import { createContext, useContext, useReducer, ReactNode } from 'react';
import { EditorState, Section, SectionType, SectionData } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { readFileAsText, parseHTMLToState } from '../utils/fileUtils';

interface EditorContextType {
  state: EditorState;
  addSection: (type: SectionType) => void;
  updateSection: (id: string, data: Partial<SectionData>) => void;
  deleteSection: (id: string) => void;
  reorderSections: (sections: Section[]) => void;
  setCurrentSection: (id: string | null) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openLibrary: () => void;
  closeLibrary: () => void;
  saveDraft: () => void;
  loadDraft: () => void;
  loadDraftFromFile: (file: File) => Promise<boolean>;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

type EditorAction =
  | { type: 'ADD_SECTION'; payload: { type: SectionType } }
  | { type: 'UPDATE_SECTION'; payload: { id: string; data: Partial<SectionData> } }
  | { type: 'DELETE_SECTION'; payload: { id: string } }
  | { type: 'REORDER_SECTIONS'; payload: { sections: Section[] } }
  | { type: 'SET_CURRENT_SECTION'; payload: { id: string | null } }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'OPEN_LIBRARY' }
  | { type: 'CLOSE_LIBRARY' }
  | { type: 'LOAD_STATE'; payload: { state: EditorState } };

const initialState: EditorState = {
  sections: [],
  currentSectionId: null,
  isDrawerOpen: false,
  isLibraryOpen: false,
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'ADD_SECTION':
      const newSection: Section = {
        id: uuidv4(),
        type: action.payload.type,
        data: action.payload.type === 'cards-carousel' 
          ? { 
              cardCount: 2, 
              cards: [
                { id: uuidv4(), title: '', subtitle: '', distance: '', cta: { text: '', url: '' }, cta2: { text: '', url: '' } },
                { id: uuidv4(), title: '', subtitle: '', distance: '', cta: { text: '', url: '' }, cta2: { text: '', url: '' } }
              ] 
            }
          : action.payload.type === 'map-locations'
          ? { locations: [] }
          : action.payload.type === 'text-boxes'
          ? { textBoxesCount: 2, textBoxes: [
              { id: uuidv4(), title: '', text: '', backgroundColor: 'white' },
              { id: uuidv4(), title: '', text: '', backgroundColor: 'white' }
            ]}
          : {},
        order: state.sections.length,
      };
      return {
        ...state,
        sections: [...state.sections, newSection],
        currentSectionId: newSection.id,
        isDrawerOpen: true,
        isLibraryOpen: false,
      };
    
    case 'UPDATE_SECTION':
      return {
        ...state,
        sections: state.sections.map(section =>
          section.id === action.payload.id
            ? { ...section, data: { ...section.data, ...action.payload.data } }
            : section
        ),
      };
    
    case 'DELETE_SECTION':
      return {
        ...state,
        sections: state.sections.filter(s => s.id !== action.payload.id),
        currentSectionId: state.currentSectionId === action.payload.id ? null : state.currentSectionId,
      };
    
    case 'REORDER_SECTIONS':
      return {
        ...state,
        sections: action.payload.sections,
      };
    
    case 'SET_CURRENT_SECTION':
      return {
        ...state,
        currentSectionId: action.payload.id,
        isDrawerOpen: action.payload.id !== null,
      };
    
    case 'OPEN_DRAWER':
      return { ...state, isDrawerOpen: true };
    
    case 'CLOSE_DRAWER':
      return { ...state, isDrawerOpen: false, currentSectionId: null };
    
    case 'OPEN_LIBRARY':
      return { ...state, isLibraryOpen: true };
    
    case 'CLOSE_LIBRARY':
      return { ...state, isLibraryOpen: false };
    
    case 'LOAD_STATE':
      return action.payload.state;
    
    default:
      return state;
  }
}

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  const addSection = (type: SectionType) => {
    dispatch({ type: 'ADD_SECTION', payload: { type } });
  };

  const updateSection = (id: string, data: Partial<SectionData>) => {
    dispatch({ type: 'UPDATE_SECTION', payload: { id, data } });
  };

  const deleteSection = (id: string) => {
    dispatch({ type: 'DELETE_SECTION', payload: { id } });
  };

  const reorderSections = (sections: Section[]) => {
    dispatch({ type: 'REORDER_SECTIONS', payload: { sections } });
  };

  const setCurrentSection = (id: string | null) => {
    dispatch({ type: 'SET_CURRENT_SECTION', payload: { id } });
  };

  const openDrawer = () => {
    dispatch({ type: 'OPEN_DRAWER' });
  };

  const closeDrawer = () => {
    dispatch({ type: 'CLOSE_DRAWER' });
  };

  const openLibrary = () => {
    dispatch({ type: 'OPEN_LIBRARY' });
  };

  const closeLibrary = () => {
    dispatch({ type: 'CLOSE_LIBRARY' });
  };

  const saveDraft = () => {
    // This will be handled by the Toolbar component with file system access
    // This function is kept for backward compatibility but won't be used directly
  };

  const loadDraft = () => {
    // This will be handled by the Toolbar component with file upload
    // This function is kept for backward compatibility but won't be used directly
  };

  const loadDraftFromFile = async (file: File) => {
    try {
      const htmlContent = await readFileAsText(file);
      const parsedState = parseHTMLToState(htmlContent);
      
      if (parsedState) {
        dispatch({ type: 'LOAD_STATE', payload: { state: parsedState } });
        return true;
      } else {
        // Try to parse from localStorage backup if HTML doesn't contain state
      const saved = localStorage.getItem('jll-editor-draft');
      if (saved) {
        const parsedState = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: { state: parsedState } });
          return true;
        }
        throw new Error('Could not parse draft from file');
      }
    } catch (error) {
      console.error('Failed to load draft from file:', error);
      throw error;
    }
  };

  return (
    <EditorContext.Provider
      value={{
        state,
        addSection,
        updateSection,
        deleteSection,
        reorderSections,
        setCurrentSection,
        openDrawer,
        closeDrawer,
        openLibrary,
        closeLibrary,
        saveDraft,
        loadDraft,
        loadDraftFromFile,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}

