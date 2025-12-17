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
  max-width: 600px;
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

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 400;
  color: #01151d;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #b7c0c3;
  border-radius: 6px;
  font-size: 16px;
  font-family: 'Source Sans Pro', sans-serif;
  color: #01151d;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #09779e;
  }

  &::placeholder {
    color: #b7c0c3;
  }
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f6f9fa;
  border-radius: 6px;
  border: 1px solid #eaeff1;
`;

const FileName = styled.span`
  font-size: 14px;
  color: #01151d;
  flex: 1;
`;

const FileActions = styled.div`
  display: flex;
  gap: 8px;
`;

const FileButton = styled.button`
  background: none;
  border: none;
  color: #09779e;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s ease;

  &:hover {
    background: #d2f4ff;
  }

  &.delete {
    color: #d32f2f;
    
    &:hover {
      background: #ffebee;
    }
  }
`;

const AddFileButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: 1px dashed #b7c0c3;
  border-radius: 6px;
  background: #ffffff;
  color: #09779e;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #09779e;
    background: #d2f4ff;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 32px;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
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

interface FileWithId {
  id: string;
  file: File;
}

interface SaveAndSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
  onSend: (email: string, files: File[]) => void;
}

const SaveAndSendModal: React.FC<SaveAndSendModalProps> = ({ isOpen, onClose, htmlContent, onSend }) => {
  const [email, setEmail] = useState('');
  const [files, setFiles] = useState<FileWithId[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = React.useRef(false);

  // Create HTML file from content when modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (htmlContent && htmlContent.trim().length > 0 && !hasInitialized.current) {
        try {
          const blob = new Blob([htmlContent], { type: 'text/html' });
          const htmlFile = new File([blob], 'jll-content-page.html', { type: 'text/html' });
          setFiles([{ id: '1', file: htmlFile }]);
          hasInitialized.current = true;
        } catch (error) {
          console.error('Failed to create HTML file:', error);
        }
      }
    } else {
      // Reset when modal closes
      hasInitialized.current = false;
      setEmail('');
      setFiles([]);
    }
  }, [isOpen, htmlContent]);

  if (!isOpen) {
    return null;
  }

  const handleAddFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles).map((file, index) => ({
        id: `file-${Date.now()}-${index}`,
        file,
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleSend = () => {
    if (!email.trim()) {
      alert('Please enter an email address');
      return;
    }

    if (files.length === 0) {
      alert('Please add at least one file');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    onSend(email, files.map(f => f.file));
    setEmail('');
    setFiles([]);
    onClose();
  };

  const handleClose = () => {
    setEmail('');
    setFiles([]);
    onClose();
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Save & Send</ModalTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>

        <FormGroup>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="recipient@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Attachments</Label>
          <FileList>
            {files.map((fileItem) => (
              <FileItem key={fileItem.id}>
                <FileName>{fileItem.file.name}</FileName>
                <FileActions>
                  {files.length > 1 && (
                    <FileButton
                      className="delete"
                      onClick={() => handleRemoveFile(fileItem.id)}
                    >
                      Delete
                    </FileButton>
                  )}
                </FileActions>
              </FileItem>
            ))}
          </FileList>
          <AddFileButton onClick={handleAddFile}>
            + Add Another File
          </AddFileButton>
          <FileInput
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
          />
        </FormGroup>

        <ButtonGroup>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSend}>
            Send
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SaveAndSendModal;

