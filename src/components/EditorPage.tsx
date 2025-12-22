import React, { useState } from 'react';
import styled from 'styled-components';
import { useEditor } from '../context/EditorContext';
import SectionLibrary from './SectionLibrary';
import SectionEditorDrawer from './SectionEditorDrawer';
import SectionRenderer from './SectionRenderer';
import Toolbar from './Toolbar';
import PageSubheader from './PageSubheader';

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #f6f9fa;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  overflow-x: hidden;
`;

const SectionsContainer = styled.div<{ drawerOpen: boolean }>`
  flex: 1;
  padding: 40px 104px;
  display: flex;
  flex-direction: column;
  gap: 0;
  transition: margin-right 0.3s ease;
  margin-right: ${(props) => 
    props.drawerOpen ? '400px' : '0'};
`;

const SectionWrapper = styled.div<{ isDragging?: boolean; isHovered?: boolean }>`
  position: relative;
  cursor: ${props => props.isHovered ? 'grab' : 'pointer'};
  opacity: ${props => props.isDragging ? 0.5 : 1};
  transition: all 0.2s ease;
  margin: 20px 0;

  &:active {
    cursor: grabbing;
  }
`;

const DragIndicator = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: rgba(1, 21, 29, 0.5);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.2s ease;
  pointer-events: none;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &::before {
    content: '☰';
    color: #ffffff;
    font-size: 18px;
    line-height: 1;
    font-weight: 300;
  }
`;

const InsertionZone = styled.div<{ isVisible: boolean; isHovered: boolean }>`
  position: relative;
  height: ${props => props.isHovered ? '60px' : '20px'};
  margin: ${props => props.isHovered ? '20px 0' : '10px 0'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  cursor: pointer;
  opacity: ${props => props.isHovered ? 1 : 0.3};
  pointer-events: auto;
  overflow: visible;

  &:hover {
    opacity: 1;
    height: 60px;
    margin: 20px 0;
  }
`;

const InsertionLine = styled.div<{ isHovered: boolean }>`
  width: 100%;
  height: 2px;
  background: ${props => props.isHovered ? '#09779e' : '#eaeff1'};
  position: relative;
  transition: all 0.2s ease;

  &::before {
    content: '+';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    background: ${props => props.isHovered ? '#09779e' : '#ffffff'};
    color: ${props => props.isHovered ? '#ffffff' : '#09779e'};
    border: 2px solid ${props => props.isHovered ? '#09779e' : '#eaeff1'};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 300;
    transition: all 0.2s ease;
    box-shadow: ${props => props.isHovered ? '0 2px 8px rgba(9, 119, 158, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)'};
  }
`;

const AddSectionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 120px;
  background: #ffffff;
  border: 2px dashed #ced5d8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  color: #56656b;
  font-weight: 400;
  margin-top: 40px;

  &:hover {
    border-color: #01151d;
    background-color: #f6f9fa;
    color: #01151d;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const EditorPage: React.FC = () => {
  const { state, openLibrary, setCurrentSection, reorderSections } = useEditor();
  const { sections, isDrawerOpen, isLibraryOpen } = state;
  const [hoveredInsertZone, setHoveredInsertZone] = useState<string | null>(null);
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  const handleInsertClick = (afterSectionId: string | null) => {
    // Store the insert position to use when section is selected
    if (afterSectionId) {
      (window as any).__pendingInsertAfter = afterSectionId;
    } else {
      (window as any).__pendingInsertAfter = null;
    }
    openLibrary();
  };

  const handleAddSectionClick = () => {
    // Clear any pending insert position for adding at the end
    (window as any).__pendingInsertAfter = undefined;
    openLibrary();
  };


  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSectionId(sectionId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', sectionId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnd = () => {
    setDraggedSectionId(null);
  };

  const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
    if (!draggedSectionId || draggedSectionId === targetSectionId) {
      setDraggedSectionId(null);
      return;
    }

    const draggedIndex = sortedSections.findIndex(s => s.id === draggedSectionId);
    const targetIndex = sortedSections.findIndex(s => s.id === targetSectionId);
    
    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedSectionId(null);
      return;
    }

    // Create new array with reordered sections
    const newSections = [...sortedSections];
    const [removed] = newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, removed);

    // Update orders
    const reorderedSections = newSections.map((section, index) => ({
      ...section,
      order: index,
    }));

    reorderSections(reorderedSections);
    setDraggedSectionId(null);
  };

  return (
    <EditorContainer>
      <Toolbar />
      <PageSubheader />
      <MainContent>
        <SectionsContainer drawerOpen={isDrawerOpen}>
          {sections.length === 0 ? (
            <AddSectionButton onClick={handleAddSectionClick}>
              <span style={{ fontSize: '24px' }}>+</span>
              <span>Add Your First Section</span>
            </AddSectionButton>
          ) : (
            <>
              {/* Insertion zone before first section */}
              <InsertionZone
                isVisible={sections.length > 0}
                isHovered={hoveredInsertZone === 'before-first'}
                onMouseEnter={() => setHoveredInsertZone('before-first')}
                onMouseLeave={() => setHoveredInsertZone(null)}
                onClick={() => handleInsertClick(null)}
              >
                <InsertionLine isHovered={hoveredInsertZone === 'before-first'} />
              </InsertionZone>

              {sortedSections.map((section) => (
                <React.Fragment key={section.id}>
                  <SectionWrapper
                    isDragging={draggedSectionId === section.id}
                    isHovered={hoveredSectionId === section.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, section.id)}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, section.id)}
                    onMouseEnter={() => setHoveredSectionId(section.id)}
                    onMouseLeave={() => setHoveredSectionId(null)}
                    onClick={() => setCurrentSection(section.id)}
                  >
                    <DragIndicator isVisible={hoveredSectionId === section.id && !draggedSectionId} />
                    <SectionRenderer section={section} />
                  </SectionWrapper>

                  {/* Insertion zone after each section - add below/between */}
                  <InsertionZone
                    isVisible={true}
                    isHovered={hoveredInsertZone === `after-${section.id}`}
                    onMouseEnter={() => setHoveredInsertZone(`after-${section.id}`)}
                    onMouseLeave={() => setHoveredInsertZone(null)}
                    onClick={() => handleInsertClick(section.id)}
                  >
                    <InsertionLine isHovered={hoveredInsertZone === `after-${section.id}`} />
                  </InsertionZone>
                </React.Fragment>
              ))}

              <AddSectionButton onClick={handleAddSectionClick}>
                <span style={{ fontSize: '24px' }}>+</span>
                <span>Add New Section</span>
              </AddSectionButton>
            </>
          )}
        </SectionsContainer>
        {isLibraryOpen && <SectionLibrary />}
        {isDrawerOpen && <SectionEditorDrawer />}
      </MainContent>
    </EditorContainer>
  );
};

export default EditorPage;
