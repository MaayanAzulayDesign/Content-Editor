import React, { useState } from 'react';
import styled from 'styled-components';
import { useEditor } from '../context/EditorContext';
import { exportToHTML } from '../utils/htmlExporter';
import { saveFileLocally, sendEmailWithAttachments } from '../utils/fileUtils';
import LoadDraftModal from './LoadDraftModal';
import SaveAndSendModal from './SaveAndSendModal';
import jllogo from '../assets/jllogo.svg';

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

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  height: 24px;
`;

const Logo = styled.img`
  height: 24px;
  width: auto;
`;

const Toolbar: React.FC = () => {
  const { state, loadDraftFromFile } = useEditor();
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [isSaveAndSendModalOpen, setIsSaveAndSendModalOpen] = useState(false);

  const handleSaveDraft = async () => {
    try {
      const htmlContent = exportToHTML(state.sections, 'draft', state);
      await saveFileLocally(htmlContent, 'jll-content-draft.html');
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert('Failed to save draft. Please try again.');
    }
  };

  const handleLoadDraft = () => {
    setIsLoadModalOpen(true);
  };

  const handleLoadDraftFile = async (file: File) => {
    try {
      const success = await loadDraftFromFile(file);
      if (success) {
        alert('Draft loaded successfully!');
      } else {
        alert('Failed to load draft. The file may not contain valid draft data.');
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
      alert('Failed to load draft. Please make sure the file is a valid draft file.');
    }
  };

  const handleExportHTML = () => {
    exportToHTML(state.sections, 'standalone');
  };

  const handleSaveAndSend = () => {
    setIsSaveAndSendModalOpen(true);
  };

  const handleSendEmail = async (email: string, files: File[]) => {
    try {
      await sendEmailWithAttachments(email, files);
      alert(`Email sent successfully to ${email}!`);
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email. Please try again.');
    }
  };

  const htmlContent = React.useMemo(() => {
    return exportToHTML(state.sections, 'draft', state);
  }, [state.sections, state]);

  return (
    <>
      <ToolbarContainer>
        <LogoContainer>
          <Logo src={jllogo} alt="JLL Logo" />
        </LogoContainer>
        <LeftActions>
          <Button onClick={handleSaveDraft}>Save Draft</Button>
          <Button onClick={handleLoadDraft}>Load Draft</Button>
        </LeftActions>
        <RightActions>
          <Button onClick={handleExportHTML}>Export HTML</Button>
          <Button variant="primary" onClick={handleSaveAndSend}>
            Save & Send
          </Button>
        </RightActions>
      </ToolbarContainer>

      <LoadDraftModal
        isOpen={isLoadModalOpen}
        onClose={() => setIsLoadModalOpen(false)}
        onLoad={handleLoadDraftFile}
      />

      <SaveAndSendModal
        isOpen={isSaveAndSendModalOpen}
        onClose={() => setIsSaveAndSendModalOpen(false)}
        htmlContent={htmlContent}
        onSend={handleSendEmail}
      />
    </>
  );
};

export default Toolbar;

