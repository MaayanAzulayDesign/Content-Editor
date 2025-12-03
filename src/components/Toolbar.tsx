import React from 'react';
import styled from 'styled-components';
import { useEditor } from '../context/EditorContext';
import { exportToHTML } from '../utils/htmlExporter';

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 104px;
  background: #ffffff;
  border-bottom: 1px solid #eaeff1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const LeftActions = styled.div`
  display: flex;
  gap: 12px;
`;

const RightActions = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.variant === 'primary' ? `
    background: #01151d;
    color: #ffffff;
    
    &:hover {
      background: #1a2d35;
    }
  ` : `
    background: rgba(30, 105, 118, 0.08);
    color: #01151d;
    
    &:hover {
      background: rgba(30, 105, 118, 0.12);
    }
  `}
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 400;
  color: #01151d;
  margin: 0;
`;

const Toolbar: React.FC = () => {
  const { state, saveDraft, loadDraft } = useEditor();

  const handleExportHTML = () => {
    exportToHTML(state.sections, 'standalone');
  };

  const handleExportTemplate = () => {
    exportToHTML(state.sections, 'template');
  };

  return (
    <ToolbarContainer>
      <Title>JLL Content Editor</Title>
      <LeftActions>
        <Button onClick={saveDraft}>Save Draft</Button>
        <Button onClick={loadDraft}>Load Draft</Button>
      </LeftActions>
      <RightActions>
        <Button onClick={handleExportHTML}>Export HTML</Button>
        <Button onClick={handleExportTemplate}>Export Template</Button>
        <Button variant="primary" onClick={handleExportHTML}>
          Save & Send
        </Button>
      </RightActions>
    </ToolbarContainer>
  );
};

export default Toolbar;

