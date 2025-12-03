import React from 'react';
import styled from 'styled-components';
import { useEditor } from '../context/EditorContext';
import SectionLibrary from './SectionLibrary';
import SectionEditorDrawer from './SectionEditorDrawer';
import SectionRenderer from './SectionRenderer';
import Toolbar from './Toolbar';
import styles from './EditorPage.module.css';

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
  gap: 40px;
  transition: margin-right 0.3s ease;
  margin-right: ${(props) => 
    props.drawerOpen ? '400px' : '0'};
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
  const { state, openLibrary, setCurrentSection } = useEditor();
  const { sections, isDrawerOpen, isLibraryOpen } = state;

  return (
    <EditorContainer>
      <Toolbar />
      <MainContent>
        <SectionsContainer drawerOpen={isDrawerOpen}>
          {sections.length === 0 ? (
            <AddSectionButton onClick={openLibrary}>
              <span style={{ fontSize: '24px' }}>+</span>
              <span>Add Your First Section</span>
            </AddSectionButton>
          ) : (
            <>
              {sections
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                  <div 
                    key={section.id} 
                    className={styles.sectionWrapper}
                    onClick={() => setCurrentSection(section.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <SectionRenderer section={section} />
                  </div>
                ))}
              <AddSectionButton onClick={openLibrary}>
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

