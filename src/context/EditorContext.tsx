import { createContext, useContext, useReducer, ReactNode } from 'react';
import { EditorState, Section, SectionType, SectionData } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { readFileAsText, parseHTMLToState } from '../utils/fileUtils';

interface EditorContextType {
  state: EditorState;
  addSection: (type: SectionType, insertAfter?: string) => void;
  updateSection: (id: string, data: Partial<SectionData>) => void;
  deleteSection: (id: string) => void;
  reorderSections: (sections: Section[]) => void;
  setCurrentSection: (id: string | null) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openLibrary: () => void;
  closeLibrary: () => void;
  updatePagePath: (path: string) => void;
  saveDraft: () => void;
  loadDraft: () => void;
  loadDraftFromFile: (file: File) => Promise<boolean>;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

type EditorAction =
  | { type: 'ADD_SECTION'; payload: { type: SectionType; insertAfter?: string } }
  | { type: 'UPDATE_SECTION'; payload: { id: string; data: Partial<SectionData> } }
  | { type: 'DELETE_SECTION'; payload: { id: string } }
  | { type: 'REORDER_SECTIONS'; payload: { sections: Section[] } }
  | { type: 'SET_CURRENT_SECTION'; payload: { id: string | null } }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'OPEN_LIBRARY' }
  | { type: 'CLOSE_LIBRARY' }
  | { type: 'UPDATE_PAGE_PATH'; payload: { path: string } }
  | { type: 'LOAD_STATE'; payload: { state: EditorState } };

const initialState: EditorState = {
  sections: [],
  currentSectionId: null,
  isDrawerOpen: false,
  isLibraryOpen: false,
  pagePath: '',
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
          : action.payload.type === 'hero-image-title-ctas'
          ? { heroTitleLarge: '', heroCTAs: [{ text: '', url: '' }] }
          : {},
        order: 0,
      };
      
      let updatedSections: Section[];
      const sortedSections = [...state.sections].sort((a, b) => a.order - b.order);
      
      if (action.payload.insertAfter === null) {
        // Insert at the beginning
        newSection.order = sortedSections.length > 0 ? sortedSections[0].order - 1 : 0;
        // Shift all existing sections down
        updatedSections = sortedSections.map(s => ({ ...s, order: s.order + 1 }));
        updatedSections.unshift(newSection);
      } else if (action.payload.insertAfter) {
        // Insert after specified section
        const insertIndex = sortedSections.findIndex(s => s.id === action.payload.insertAfter);
        if (insertIndex >= 0) {
          const afterSection = sortedSections[insertIndex];
          newSection.order = afterSection.order + 1;
          // Reorder all sections after the insertion point
          updatedSections = sortedSections.map(s => 
            s.order > afterSection.order ? { ...s, order: s.order + 1 } : s
          );
          updatedSections.splice(insertIndex + 1, 0, newSection);
        } else {
          // Section not found, add to end
          newSection.order = sortedSections.length > 0 ? sortedSections[sortedSections.length - 1].order + 1 : 0;
          updatedSections = [...sortedSections, newSection];
        }
      } else {
        // Add to end (insertAfter is undefined)
        newSection.order = sortedSections.length > 0 ? sortedSections[sortedSections.length - 1].order + 1 : 0;
        updatedSections = [...sortedSections, newSection];
      }
      
      return {
        ...state,
        sections: updatedSections,
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
    
    case 'UPDATE_PAGE_PATH':
      return { ...state, pagePath: action.payload.path };
    
    case 'LOAD_STATE':
      return action.payload.state;
    
    default:
      return state;
  }
}

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  const addSection = (type: SectionType, insertAfter?: string) => {
    dispatch({ type: 'ADD_SECTION', payload: { type, insertAfter } });
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

  const updatePagePath = (path: string) => {
    dispatch({ type: 'UPDATE_PAGE_PATH', payload: { path } });
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
        updatePagePath,
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

