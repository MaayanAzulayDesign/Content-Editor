import { createContext, useContext, useReducer, ReactNode } from 'react';
import { EditorState, Section, SectionType, SectionData, Language } from '../types';
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
  setLanguage: (language: Language) => void;
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
  | { type: 'SET_LANGUAGE'; payload: { language: Language } }
  | { type: 'LOAD_STATE'; payload: { state: EditorState } };

// Helper function to get placeholder text based on language
function getPlaceholderText(language: Language, type: 'title' | 'subtitle' | 'text' | 'cta'): string {
  const placeholders: Record<Language, { title: string; subtitle: string; text: string; cta: string }> = {
    'en': { title: 'Title', subtitle: 'Subtitle', text: 'Text', cta: 'CTA' },
    'pt': { title: 'Título', subtitle: 'Subtítulo', text: 'Texto', cta: 'CTA' },
    'zh-CN': { title: '标题', subtitle: '副标题', text: '文本', cta: '按钮' },
    'zh-TW': { title: '標題', subtitle: '副標題', text: '文本', cta: '按鈕' },
  };
  return placeholders[language][type];
}

// Helper function to set placeholder text fields for translation
function clearTextFields(data: SectionData, language: Language): SectionData {
  const cleared: SectionData = { ...data };
  const titlePlaceholder = getPlaceholderText(language, 'title');
  const subtitlePlaceholder = getPlaceholderText(language, 'subtitle');
  const textPlaceholder = getPlaceholderText(language, 'text');
  const ctaPlaceholder = getPlaceholderText(language, 'cta');
  
  // Set placeholder text for title fields (only if they have existing text)
  if (cleared.heroTitle) cleared.heroTitle = titlePlaceholder;
  if (cleared.heroTitleLarge) cleared.heroTitleLarge = titlePlaceholder;
  if (cleared.title) cleared.title = titlePlaceholder;
  if (cleared.heading) cleared.heading = titlePlaceholder;
  if (cleared.plainTitle) cleared.plainTitle = titlePlaceholder;
  if (cleared.carouselTitle) cleared.carouselTitle = titlePlaceholder;
  if (cleared.mapTitle) cleared.mapTitle = titlePlaceholder;
  
  // Set placeholder text for subtitle fields (only if they have existing text)
  if (cleared.carouselSubtitle) cleared.carouselSubtitle = subtitlePlaceholder;
  
  // Set placeholder text for text fields (only if they have existing text)
  if (cleared.heroText) cleared.heroText = textPlaceholder;
  if (cleared.text) cleared.text = textPlaceholder;
  if (cleared.bodyText) cleared.bodyText = textPlaceholder;
  if (cleared.plainBody) cleared.plainBody = textPlaceholder;
  if (cleared.mapDescription) cleared.mapDescription = textPlaceholder;
  
  // Set placeholder text for CTA buttons (only if they have existing text)
  if (cleared.heroCTA && cleared.heroCTA.text) {
    cleared.heroCTA = { ...cleared.heroCTA, text: ctaPlaceholder };
  }
  if (cleared.cta && cleared.cta.text) {
    cleared.cta = { ...cleared.cta, text: ctaPlaceholder };
  }
  if (cleared.cta2 && cleared.cta2.text) {
    cleared.cta2 = { ...cleared.cta2, text: ctaPlaceholder };
  }
  if (cleared.heroCTAs) {
    cleared.heroCTAs = cleared.heroCTAs.map(cta => 
      cta.text ? { ...cta, text: ctaPlaceholder } : cta
    );
  }
  if (cleared.ctas) {
    cleared.ctas = cleared.ctas.map(cta => 
      cta.text ? { ...cta, text: ctaPlaceholder } : cta
    );
  }
  
  // Set placeholder text for cards (only if they have existing text)
  if (cleared.cards) {
    cleared.cards = cleared.cards.map(card => ({
      ...card,
      title: card.title ? titlePlaceholder : '',
      subtitle: card.subtitle ? subtitlePlaceholder : '',
      distance: card.distance ? textPlaceholder : '',
      cta: card.cta ? { ...card.cta, text: card.cta.text ? ctaPlaceholder : '' } : { text: '', url: '' },
      cta2: card.cta2 ? { ...card.cta2, text: card.cta2.text ? ctaPlaceholder : '' } : { text: '', url: '' },
    }));
  }
  
  // Set placeholder text for text boxes (only if they have existing text)
  if (cleared.textBoxes) {
    cleared.textBoxes = cleared.textBoxes.map(box => ({
      ...box,
      title: box.title ? titlePlaceholder : '',
      text: box.text ? textPlaceholder : '',
    }));
  }
  
  // Set placeholder text for locations (only if they have existing text)
  if (cleared.locations) {
    cleared.locations = cleared.locations.map(location => ({
      ...location,
      name: location.name ? titlePlaceholder : '',
      address: location.address ? textPlaceholder : '',
      cta: location.cta ? { ...location.cta, text: location.cta.text ? ctaPlaceholder : '' } : undefined,
    }));
  }
  
  return cleared;
}

// Helper function to copy section structure (preserve images, structure, but set placeholder text)
function copySectionForTranslation(section: Section, language: Language): Section {
  return {
    ...section,
    id: uuidv4(), // New ID for translated version
    data: clearTextFields(section.data, language),
  };
}

// Helper function to sync section structure from English to other languages
function syncSectionStructure(sourceSection: Section, targetSection: Section, language: Language): Section {
  // Preserve the target section's translated text, but update structure
  const syncedData: SectionData = { ...targetSection.data };
  const titlePlaceholder = getPlaceholderText(language, 'title');
  const subtitlePlaceholder = getPlaceholderText(language, 'subtitle');
  const textPlaceholder = getPlaceholderText(language, 'text');
  const ctaPlaceholder = getPlaceholderText(language, 'cta');
  
  // Copy non-text fields from source (images, counts, etc.)
  if (sourceSection.data.heroImage) syncedData.heroImage = sourceSection.data.heroImage;
  if (sourceSection.data.heroImageRight) syncedData.heroImageRight = sourceSection.data.heroImageRight;
  if (sourceSection.data.image) syncedData.image = sourceSection.data.image;
  if (sourceSection.data.cardCount !== undefined) syncedData.cardCount = sourceSection.data.cardCount;
  if (sourceSection.data.textBoxesCount !== undefined) syncedData.textBoxesCount = sourceSection.data.textBoxesCount;
  
  // Sync card structure (preserve translated text if exists, add new cards if needed)
  if (sourceSection.data.cards) {
    const sourceCards = sourceSection.data.cards;
    const targetCards = syncedData.cards || [];
    syncedData.cards = sourceCards.map((sourceCard, index) => {
      const existingCard = targetCards[index];
      if (existingCard && existingCard.id) {
        // Preserve existing card with its translations
        return {
          ...existingCard,
          image: sourceCard.image || existingCard.image,
        };
      } else {
        // New card - set placeholder text in target language
        return {
          id: uuidv4(),
          title: sourceCard.title ? titlePlaceholder : '',
          subtitle: sourceCard.subtitle ? subtitlePlaceholder : '',
          distance: sourceCard.distance ? textPlaceholder : '',
          image: sourceCard.image,
          cta: { text: sourceCard.cta?.text ? ctaPlaceholder : '', url: sourceCard.cta?.url || '' },
          cta2: { text: sourceCard.cta2?.text ? ctaPlaceholder : '', url: sourceCard.cta2?.url || '' },
        };
      }
    });
  }
  
  // Sync text boxes structure
  if (sourceSection.data.textBoxes) {
    const sourceBoxes = sourceSection.data.textBoxes;
    const targetBoxes = syncedData.textBoxes || [];
    syncedData.textBoxes = sourceBoxes.map((sourceBox, index) => {
      const existingBox = targetBoxes[index];
      if (existingBox && existingBox.id) {
        // Preserve existing box with its translations
        return {
          ...existingBox,
          backgroundColor: sourceBox.backgroundColor || existingBox.backgroundColor,
        };
      } else {
        // New box - set placeholder text in target language
        return {
          id: uuidv4(),
          title: sourceBox.title ? titlePlaceholder : '',
          text: sourceBox.text ? textPlaceholder : '',
          backgroundColor: sourceBox.backgroundColor || 'white',
        };
      }
    });
  }
  
  // Sync locations structure
  if (sourceSection.data.locations) {
    const sourceLocations = sourceSection.data.locations;
    const targetLocations = syncedData.locations || [];
    syncedData.locations = sourceLocations.map((sourceLocation, index) => {
      const existingLocation = targetLocations[index];
      if (existingLocation && existingLocation.id) {
        // Preserve existing location with its translations
        return {
          ...existingLocation,
          lat: sourceLocation.lat,
          lng: sourceLocation.lng,
          propertyCount: sourceLocation.propertyCount,
          cta: existingLocation.cta ? {
            ...existingLocation.cta,
            url: sourceLocation.cta?.url || existingLocation.cta.url,
          } : sourceLocation.cta,
        };
      } else {
        // New location - set placeholder text in target language
        return {
          id: uuidv4(),
          name: sourceLocation.name ? titlePlaceholder : '',
          address: sourceLocation.address ? textPlaceholder : '',
          lat: sourceLocation.lat,
          lng: sourceLocation.lng,
          propertyCount: sourceLocation.propertyCount,
          cta: sourceLocation.cta ? { text: sourceLocation.cta.text ? ctaPlaceholder : '', url: sourceLocation.cta.url } : undefined,
        };
      }
    });
  }
  
  // Sync CTA arrays structure
  if (sourceSection.data.heroCTAs) {
    const sourceCTAs = sourceSection.data.heroCTAs;
    const targetCTAs = syncedData.heroCTAs || [];
    syncedData.heroCTAs = sourceCTAs.map((sourceCTA, index) => {
      const existingCTA = targetCTAs[index];
      if (existingCTA) {
        return { ...existingCTA, url: sourceCTA.url };
      } else {
        return { text: sourceCTA.text ? ctaPlaceholder : '', url: sourceCTA.url };
      }
    });
  }
  
  if (sourceSection.data.ctas) {
    const sourceCTAs = sourceSection.data.ctas;
    const targetCTAs = syncedData.ctas || [];
    syncedData.ctas = sourceCTAs.map((sourceCTA, index) => {
      const existingCTA = targetCTAs[index];
      if (existingCTA) {
        return { ...existingCTA, url: sourceCTA.url };
      } else {
        return { text: sourceCTA.text ? ctaPlaceholder : '', url: sourceCTA.url };
      }
    });
  }
  
  // Sync single CTAs
  if (sourceSection.data.heroCTA) {
    syncedData.heroCTA = {
      ...(syncedData.heroCTA || { text: sourceSection.data.heroCTA.text ? ctaPlaceholder : '', url: '' }),
      url: sourceSection.data.heroCTA.url,
    };
  }
  if (sourceSection.data.cta) {
    syncedData.cta = {
      ...(syncedData.cta || { text: sourceSection.data.cta.text ? ctaPlaceholder : '', url: '' }),
      url: sourceSection.data.cta.url,
    };
  }
  if (sourceSection.data.cta2) {
    syncedData.cta2 = {
      ...(syncedData.cta2 || { text: sourceSection.data.cta2.text ? ctaPlaceholder : '', url: '' }),
      url: sourceSection.data.cta2.url,
    };
  }
  
  return {
    ...targetSection,
    type: sourceSection.type,
    order: sourceSection.order,
    data: syncedData,
  };
}

const initialState: EditorState = {
  sections: [],
  currentSectionId: null,
  isDrawerOpen: false,
  isLibraryOpen: false,
  pagePath: '',
  currentLanguage: 'en',
  translations: {
    en: [],
    pt: [],
    'zh-CN': [],
    'zh-TW': [],
  },
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'ADD_SECTION': {
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
      
      // If adding to English, also add to other languages with cleared text
      const newTranslations = { ...state.translations };
      newTranslations[state.currentLanguage] = updatedSections;
      
      if (state.currentLanguage === 'en') {
        // Add to other languages with cleared text
        const otherLanguages: Language[] = ['pt', 'zh-CN', 'zh-TW'];
        otherLanguages.forEach(lang => {
          const langSections = [...newTranslations[lang]];
          const translatedSection = copySectionForTranslation(newSection, lang);
          
          // Find insertion position in other language
          const langSorted = [...langSections].sort((a, b) => a.order - b.order);
          if (action.payload.insertAfter === null) {
            translatedSection.order = langSorted.length > 0 ? langSorted[0].order - 1 : 0;
            const langUpdated = langSorted.map(s => ({ ...s, order: s.order + 1 }));
            langUpdated.unshift(translatedSection);
            newTranslations[lang] = langUpdated;
          } else if (action.payload.insertAfter) {
            // Find corresponding section in other language by order
            const sourceSection = sortedSections.find(s => s.id === action.payload.insertAfter);
            if (sourceSection) {
              const insertIndex = langSorted.findIndex(s => s.order === sourceSection.order);
              if (insertIndex >= 0) {
                const afterSection = langSorted[insertIndex];
                translatedSection.order = afterSection.order + 1;
                const langUpdated = langSorted.map(s => 
                  s.order > afterSection.order ? { ...s, order: s.order + 1 } : s
                );
                langUpdated.splice(insertIndex + 1, 0, translatedSection);
                newTranslations[lang] = langUpdated;
              } else {
                translatedSection.order = langSorted.length > 0 ? langSorted[langSorted.length - 1].order + 1 : 0;
                newTranslations[lang] = [...langSorted, translatedSection];
              }
            } else {
              translatedSection.order = langSorted.length > 0 ? langSorted[langSorted.length - 1].order + 1 : 0;
              newTranslations[lang] = [...langSorted, translatedSection];
            }
          } else {
            translatedSection.order = langSorted.length > 0 ? langSorted[langSorted.length - 1].order + 1 : 0;
            newTranslations[lang] = [...langSorted, translatedSection];
          }
        });
      }
      
      return {
        ...state,
        sections: updatedSections,
        translations: newTranslations,
        currentSectionId: newSection.id,
        isDrawerOpen: true,
        isLibraryOpen: false,
      };
    }
    
    case 'UPDATE_SECTION': {
      const updatedSections = state.sections.map(section =>
        section.id === action.payload.id
          ? { ...section, data: { ...section.data, ...action.payload.data } }
          : section
      );
      
      // Update translations for current language
      const newTranslations = { ...state.translations };
      newTranslations[state.currentLanguage] = updatedSections;
      
      // If updating English, sync structure to other languages
      if (state.currentLanguage === 'en') {
        const updatedSection = updatedSections.find(s => s.id === action.payload.id);
        if (updatedSection) {
          const otherLanguages: Language[] = ['pt', 'zh-CN', 'zh-TW'];
          otherLanguages.forEach(lang => {
            const langSections = [...newTranslations[lang]];
            const langSectionIndex = langSections.findIndex(s => {
              // Find by matching order (sections should be in sync by order)
              return s.order === updatedSection.order;
            });
            
            if (langSectionIndex >= 0) {
              // Sync structure while preserving translations
              langSections[langSectionIndex] = syncSectionStructure(updatedSection, langSections[langSectionIndex], lang);
            } else {
              // Section doesn't exist in this language, add it
              const newLangSection = copySectionForTranslation(updatedSection, lang);
              langSections.push(newLangSection);
              langSections.sort((a, b) => a.order - b.order);
            }
            newTranslations[lang] = langSections;
          });
        }
      }
      
      return {
        ...state,
        sections: updatedSections,
        translations: newTranslations,
      };
    }
    
    case 'DELETE_SECTION': {
      const deletedSection = state.sections.find(s => s.id === action.payload.id);
      const updatedSections = state.sections.filter(s => s.id !== action.payload.id);
      
      // Update translations
      const newTranslations = { ...state.translations };
      newTranslations[state.currentLanguage] = updatedSections;
      
      // If deleting from English, delete from other languages too
      if (state.currentLanguage === 'en' && deletedSection) {
        const otherLanguages: Language[] = ['pt', 'zh-CN', 'zh-TW'];
        otherLanguages.forEach(lang => {
          const langSections = [...newTranslations[lang]];
          const langSectionIndex = langSections.findIndex(s => s.order === deletedSection.order);
          if (langSectionIndex >= 0) {
            langSections.splice(langSectionIndex, 1);
            newTranslations[lang] = langSections;
          }
        });
      }
      
      return {
        ...state,
        sections: updatedSections,
        translations: newTranslations,
        currentSectionId: state.currentSectionId === action.payload.id ? null : state.currentSectionId,
      };
    }
    
    case 'REORDER_SECTIONS': {
      const newTranslations = { ...state.translations };
      newTranslations[state.currentLanguage] = action.payload.sections;
      
      // If reordering English, reorder other languages by matching order
      if (state.currentLanguage === 'en') {
        const otherLanguages: Language[] = ['pt', 'zh-CN', 'zh-TW'];
        otherLanguages.forEach(lang => {
          const langSections = [...newTranslations[lang]];
          // Reorder by matching order values
          const reordered = action.payload.sections.map(enSection => {
            const matching = langSections.find(ls => ls.order === enSection.order);
            return matching || copySectionForTranslation(enSection, lang);
          });
          newTranslations[lang] = reordered;
        });
      }
      
      return {
        ...state,
        sections: action.payload.sections,
        translations: newTranslations,
      };
    }
    
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
    
    case 'SET_LANGUAGE': {
      const newLanguage = action.payload.language;
      const newTranslations = { ...state.translations };
      
      // Save current language sections
      newTranslations[state.currentLanguage] = [...state.sections];
      
      // Load sections for new language
      let newSections = newTranslations[newLanguage] || [];
      
      // If switching to non-English and sections don't exist, copy from English
      if (newLanguage !== 'en' && newSections.length === 0 && newTranslations.en.length > 0) {
        newSections = newTranslations.en.map(section => copySectionForTranslation(section, newLanguage));
        newTranslations[newLanguage] = newSections;
      }
      
      // If switching back to English, sync structure from English to other languages
      if (newLanguage === 'en' && state.currentLanguage !== 'en') {
        const englishSections = newTranslations.en;
        const otherLanguages: Language[] = ['pt', 'zh-CN', 'zh-TW'];
        otherLanguages.forEach(lang => {
          const langSections = [...(newTranslations[lang] || [])];
          const syncedSections = englishSections.map(enSection => {
            const existing = langSections.find(ls => ls.order === enSection.order);
            if (existing) {
              return syncSectionStructure(enSection, existing, lang);
            } else {
              return copySectionForTranslation(enSection, lang);
            }
          });
          newTranslations[lang] = syncedSections;
        });
      }
      
      return {
        ...state,
        currentLanguage: newLanguage,
        sections: newSections,
        translations: newTranslations,
        currentSectionId: null,
        isDrawerOpen: false,
      };
    }
    
    case 'LOAD_STATE':
      // Ensure loaded state has language support
      const loadedState = action.payload.state;
      return {
        ...loadedState,
        currentLanguage: loadedState.currentLanguage || 'en',
        translations: loadedState.translations || {
          en: loadedState.sections || [],
          pt: [],
          'zh-CN': [],
          'zh-TW': [],
        },
      };
    
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

  const setLanguage = (language: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: { language } });
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
        setLanguage,
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

