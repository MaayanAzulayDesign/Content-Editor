export type SectionType = 
  | 'hero-image-text'
  | 'hero-image-title-ctas'
  | 'image-text-left'
  | 'image-text-right'
  | 'text-cta'
  | 'cards-carousel'
  | 'plain-text'
  | 'map-locations'
  | 'text-boxes';

export interface CTA {
  text: string;
  url: string;
  variant?: 'primary' | 'secondary';
}

export interface ImageData {
  url: string;
  alt?: string;
  cloudUrl?: string;
  localFile?: File;
}

export interface Section {
  id: string;
  type: SectionType;
  data: SectionData;
  order: number;
}

export interface SectionData {
  // Hero with image and text overlay
  heroImage?: ImageData;
  heroTitle?: string;
  heroText?: string;
  heroCTA?: CTA;
  
  // Hero with image, title & CTAs (image on right)
  heroTitleLarge?: string;
  heroCTAs?: CTA[];
  heroImageRight?: ImageData;
  
  // Image + Text sections
  image?: ImageData;
  title?: string;
  text?: string;
  cta?: CTA;
  cta2?: CTA;
  imagePosition?: 'left' | 'right';
  
  // Text + CTA section
  heading?: string;
  bodyText?: string;
  ctas?: CTA[];
  
  // Cards Carousel
  carouselTitle?: string;
  carouselSubtitle?: string;
  cardCount?: number;
  cards?: CardData[];
  
  // Plain Text
  plainTitle?: string;
  plainBody?: string;
  
  // Map Locations
  mapTitle?: string;
  mapDescription?: string;
  locations?: LocationData[];
  
  // Text Boxes
  textBoxesCount?: number;
  textBoxes?: TextBoxData[];
}

export interface TextBoxData {
  id: string;
  title: string;
  text: string;
  backgroundColor?: 'white' | 'light-grey';
}

export interface CardData {
  id: string;
  image?: ImageData;
  title: string;
  subtitle?: string;
  cta?: CTA;
  cta2?: CTA;
  distance?: string;
}

export interface LocationData {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  propertyCount?: number;
  cta?: CTA;
}

export interface EditorState {
  sections: Section[];
  currentSectionId: string | null;
  isDrawerOpen: boolean;
  isLibraryOpen: boolean;
  pagePath?: string; // e.g., "/services/letting"
}

