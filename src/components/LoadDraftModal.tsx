import React, { useRef, useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
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
  width: 32px;
  height: 32px;
  border-radius: 4px;
  transition: background 0.2s ease;

  &:hover {
    background: #eaeff1;
  }
`;

const DropZone = styled.div<{ isDragging: boolean }>`
  border: 2px dashed ${props => props.isDragging ? '#09779e' : '#b7c0c3'};
  border-radius: 8px;
  padding: 48px 24px;
  text-align: center;
  background: ${props => props.isDragging ? '#d2f4ff' : '#f6f9fa'};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: #09779e;
    background: #d2f4ff;
  }
`;

const DropZoneText = styled.p`
  font-size: 16px;
  font-family: 'Source Sans Pro', sans-serif;
  color: #56656b;
  margin: 0 0 8px 0;
`;

const DropZoneSubtext = styled.p`
  font-size: 14px;
  font-family: 'Source Sans Pro', sans-serif;
  color: #b7c0c3;
  margin: 0;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInfo = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #eaeff1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FileName = styled.span`
  font-size: 14px;
  font-family: 'Source Sans Pro', sans-serif;
  color: #01151d;
`;

const RemoveFileButton = styled.button`
  background: none;
  border: none;
  color: #56656b;
  cursor: pointer;
  font-size: 14px;
  font-family: 'Source Sans Pro', sans-serif;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s ease;

  &:hover {
    background: #dfe5e8;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  font-size: 16px;
  font-weight: 400;
  font-family: 'Source Sans Pro', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.variant === 'primary' ? `
    background: #01151d;
    color: #ffffff;
    
    &:hover {
      background: #1a2d35;
    }
    
    &:disabled {
      background: #b7c0c3;
      cursor: not-allowed;
    }
  ` : `
    background: rgba(30, 105, 118, 0.08);
    color: #01151d;
    
    &:hover {
      background: rgba(30, 105, 118, 0.12);
    }
  `}
`;

interface LoadDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (file: File) => void;
}

const LoadDraftModal: React.FC<LoadDraftModalProps> = ({ isOpen, onClose, onLoad }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const htmlFile = files.find(file => file.type === 'text/html' || file.name.endsWith('.html'));
    
    if (htmlFile) {
      setSelectedFile(htmlFile);
    } else {
      alert('Please upload an HTML file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'text/html' || file.name.endsWith('.html')) {
        setSelectedFile(file);
      } else {
        alert('Please select an HTML file');
      }
    }
  };

  const handleLoad = () => {
    if (selectedFile) {
      onLoad(selectedFile);
      setSelectedFile(null);
      onClose();
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Load Draft</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        
        <DropZone
          isDragging={isDragging}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleDropZoneClick}
        >
          <DropZoneText>Drag and drop your HTML file here</DropZoneText>
          <DropZoneSubtext>or click to browse</DropZoneSubtext>
          <FileInput
            ref={fileInputRef}
            type="file"
            accept=".html,text/html"
            onChange={handleFileSelect}
          />
        </DropZone>

        {selectedFile && (
          <FileInfo>
            <FileName>{selectedFile.name}</FileName>
            <RemoveFileButton onClick={handleRemoveFile}>Remove</RemoveFileButton>
          </FileInfo>
        )}

        <ButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleLoad} disabled={!selectedFile}>
            Load
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoadDraftModal;


