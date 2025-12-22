import React from 'react';
import styled from 'styled-components';
import { useEditor } from '../context/EditorContext';
import { SectionType } from '../types';
import { FiX } from 'react-icons/fi';

const LibraryOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LibraryDrawer = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 500px;
  background: #ffffff;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

const LibraryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #eaeff1;
`;

const LibraryTitle = styled.h2`
  font-size: 24px;
  font-weight: 400;
  font-family: 'Source Sans Pro', sans-serif;
  color: #01151d;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #56656b;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #01151d;
  }
`;

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 24px;
  overflow-y: auto;
  flex: 1;
`;

const LayoutCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: #f6f9fa;
  border: 2px solid #ced5d8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  
  &:hover {
    border-color: #01151d;
    background: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const LayoutIcon = styled.div`
  width: 100%;
  height: 60px;
  background: #ffffff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const WireframeBox = styled.div`
  background: #e5e7eb;
  border-radius: 3px;
`;

// Hero with Image & Text wireframe
const HeroWireframe = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: #d1d5db;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    width: 60%;
    height: 8px;
    background: #e5e7eb;
    border-radius: 3px;
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 8px;
    width: 40%;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    z-index: 1;
  }
`;

// Image + Text wireframe (left)
const ImageTextLeftWireframe = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 6px;
  padding: 2px;
  
  ${WireframeBox}:first-child {
    width: 45%;
    height: 100%;
    background: #d1d5db;
    border-radius: 3px;
  }
  
  ${WireframeBox}:last-child {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 4px;
    background: transparent;
    
    &::before {
      content: '';
      width: 80%;
      height: 6px;
      background: #e5e7eb;
      border-radius: 3px;
    }
    
    &::after {
      content: '';
      width: 60%;
      height: 6px;
      background: #e5e7eb;
      border-radius: 3px;
      margin-top: 2px;
    }
  }
`;

// Image + Text wireframe (right)
const ImageTextRightWireframe = styled(ImageTextLeftWireframe)`
  flex-direction: row-reverse;
`;

// Hero with Image, Title & CTAs wireframe (image on right)
const HeroImageTitleCTAsWireframe = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 6px;
  padding: 2px;
  position: relative;
  
  ${WireframeBox}:first-child {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 4px;
    background: transparent;
    justify-content: flex-start;
    
    &::before {
      content: '';
      width: 90%;
      height: 11px;
      background: #e5e7eb;
      border-radius: 3px;
    }
    
    &::after {
      content: '';
      width: 70%;
      height: 3px;
      background: #e5e7eb;
      border-radius: 3px;
      margin-top: 2px;
    }
  }
  
  ${WireframeBox}:last-child {
    width: 45%;
    height: 100%;
    background: #d1d5db;
    border-radius: 3px;
  }
  
  &::before {
    content: '';
    position: absolute;
    bottom: 12px;
    left: 4px;
    width: 22%;
    height: 7px;
    background: #d1d5db;
    border-radius: 3px;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 12px;
    left: calc(22% + 10px);
    width: 22%;
    height: 7px;
    background: #d1d5db;
    border-radius: 3px;
  }
`;

// Text + CTA wireframe

// Text + CTA wireframe
const TextCTAWireframe = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 4px;
  align-items: center;
  justify-content: center;
  
  ${WireframeBox}:first-child {
    width: 70%;
    height: 8px;
    background: #e5e7eb;
    border-radius: 3px;
  }
  
  ${WireframeBox}:nth-child(2) {
    width: 85%;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
  }
  
  ${WireframeBox}:nth-child(3) {
    width: 60%;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    margin-top: 2px;
  }
  
  &::after {
    content: '';
    width: 35%;
    height: 10px;
    background: #d1d5db;
    border-radius: 3px;
    margin-top: 4px;
  }
`;

// Cards Carousel wireframe
const CardsCarouselWireframe = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 4px;
  padding: 2px;
  position: relative;
  
  ${WireframeBox} {
    flex: 1;
    height: 100%;
    background: #e5e7eb;
    border-radius: 3px;
    position: relative;
    min-width: 0;
    
    &::before {
      content: '';
      position: absolute;
      top: 4px;
      left: 4px;
      width: 50%;
      height: 4px;
      background: #d1d5db;
      border-radius: 2px;
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 3px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  &::after {
    content: '';
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 3px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

// Plain Text wireframe
const PlainTextWireframe = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px;
  
  ${WireframeBox}:first-child {
    width: 70%;
    height: 8px;
    background: #e5e7eb;
    border-radius: 3px;
  }
  
  ${WireframeBox}:nth-child(2) {
    width: 100%;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
  }
  
  ${WireframeBox}:nth-child(3) {
    width: 90%;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
  }
  
  ${WireframeBox}:nth-child(4) {
    width: 80%;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
  }
`;

// Map wireframe
const MapWireframe = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: #e5e7eb;
  border-radius: 3px;
  
  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 30%;
    width: 8px;
    height: 8px;
    background: #de0614;
    border-radius: 50%;
    border: 2px solid #ffffff;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 60%;
    left: 70%;
    width: 8px;
    height: 8px;
    background: #de0614;
    border-radius: 50%;
    border: 2px solid #ffffff;
  }
`;

// Text Boxes wireframe
const TextBoxesWireframe = styled.div<{ count: number }>`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 6px;
  padding: 2px;
  
  ${WireframeBox} {
    flex: 1;
    height: 100%;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 4px;
    
    &::before {
      content: '';
      width: 60%;
      height: 6px;
      background: #e5e7eb;
      border-radius: 2px;
    }
    
    &::after {
      content: '';
      width: 100%;
      height: 4px;
      background: #e5e7eb;
      border-radius: 2px;
      margin-top: 2px;
    }
  }
`;

const LayoutName = styled.span`
  font-size: 14px;
  font-family: 'Source Sans Pro', sans-serif;
  color: #01151d;
  font-weight: 400;
`;

interface WireframeIconProps {
  type: SectionType;
}

const WireframeIcon: React.FC<WireframeIconProps> = ({ type }) => {
  switch (type) {
    case 'hero-image-text':
      return <HeroWireframe />;
    case 'hero-image-title-ctas':
      return (
        <HeroImageTitleCTAsWireframe>
          <WireframeBox />
          <WireframeBox />
        </HeroImageTitleCTAsWireframe>
      );
    case 'image-text-left':
      return (
        <ImageTextLeftWireframe>
          <WireframeBox />
          <WireframeBox />
        </ImageTextLeftWireframe>
      );
    case 'image-text-right':
      return (
        <ImageTextRightWireframe>
          <WireframeBox />
          <WireframeBox />
        </ImageTextRightWireframe>
      );
    case 'text-cta':
      return (
        <TextCTAWireframe>
          <WireframeBox />
          <WireframeBox />
          <WireframeBox />
        </TextCTAWireframe>
      );
    case 'cards-carousel':
      return (
        <CardsCarouselWireframe>
          <WireframeBox />
          <WireframeBox />
          <WireframeBox />
        </CardsCarouselWireframe>
      );
    case 'plain-text':
      return (
        <PlainTextWireframe>
          <WireframeBox />
          <WireframeBox />
          <WireframeBox />
          <WireframeBox />
        </PlainTextWireframe>
      );
    case 'map-locations':
      return <MapWireframe />;
    case 'text-boxes':
      return (
        <TextBoxesWireframe count={2}>
          <WireframeBox />
          <WireframeBox />
        </TextBoxesWireframe>
      );
    default:
      return null;
  }
};

const sectionLayouts: { type: SectionType; name: string }[] = [
  { type: 'hero-image-text', name: 'Hero with Image & Text' },
  { type: 'hero-image-title-ctas', name: 'Hero with Image, Title & CTA\'s' },
  { type: 'image-text-left', name: 'Image Left, Text Right' },
  { type: 'image-text-right', name: 'Image Right, Text Left' },
  { type: 'text-cta', name: 'Text with CTA' },
  { type: 'cards-carousel', name: 'Cards Carousel' },
  { type: 'plain-text', name: 'Plain Text' },
  { type: 'map-locations', name: 'Map with Locations' },
  { type: 'text-boxes', name: 'Text Boxes' },
];

const SectionLibrary: React.FC = () => {
  const { state, addSection, closeLibrary } = useEditor();
  const { isLibraryOpen } = state;

  if (!isLibraryOpen) return null;

  const handleSelectLayout = (type: SectionType) => {
    const insertAfter = (window as any).__pendingInsertAfter;
    // If insertAfter is null, it means insert at the beginning
    // If insertAfter is undefined, it means add at the end (default behavior)
    // If insertAfter is a string, it means insert after that section
    if (insertAfter === null) {
      addSection(type, undefined); // Insert at beginning (no insertAfter means first position)
    } else if (insertAfter === undefined) {
      addSection(type); // Add at end (default)
    } else {
      addSection(type, insertAfter); // Insert after specific section
    }
    (window as any).__pendingInsertAfter = undefined;
    closeLibrary();
  };

  return (
    <>
      <LibraryOverlay onClick={closeLibrary} />
      <LibraryDrawer onClick={(e) => e.stopPropagation()}>
        <LibraryHeader>
          <LibraryTitle>Choose a Section Layout</LibraryTitle>
          <CloseButton onClick={closeLibrary}>
            <FiX />
          </CloseButton>
        </LibraryHeader>
        <LayoutGrid>
          {sectionLayouts.map((layout) => (
            <LayoutCard
              key={layout.type}
              onClick={() => handleSelectLayout(layout.type)}
            >
              <LayoutIcon>
                <WireframeIcon type={layout.type} />
              </LayoutIcon>
              <LayoutName>{layout.name}</LayoutName>
            </LayoutCard>
          ))}
        </LayoutGrid>
      </LibraryDrawer>
    </>
  );
};

export default SectionLibrary;

