import React from 'react';
import { Section } from '../types';
import HeroImageText from './sections/HeroImageText';
import ImageText from './sections/ImageText';
import TextCTA from './sections/TextCTA';
import CardsCarousel from './sections/CardsCarousel';
import PlainText from './sections/PlainText';
import MapLocations from './sections/MapLocations';
import TextBoxes from './sections/TextBoxes';

interface SectionRendererProps {
  section: Section;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  switch (section.type) {
    case 'hero-image-text':
      return <HeroImageText data={section.data} />;
    case 'image-text-left':
      return <ImageText data={section.data} imagePosition="left" />;
    case 'image-text-right':
      return <ImageText data={section.data} imagePosition="right" />;
    case 'text-cta':
      return <TextCTA data={section.data} />;
    case 'cards-carousel':
      return <CardsCarousel data={section.data} />;
    case 'plain-text':
      return <PlainText data={section.data} />;
    case 'map-locations':
      return <MapLocations data={section.data} sectionId={section.id} />;
    case 'text-boxes':
      return <TextBoxes data={section.data} />;
    default:
      return <div>Unknown section type</div>;
  }
};

export default SectionRenderer;

