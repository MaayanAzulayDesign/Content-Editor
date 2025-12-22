import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { ImageData } from '../types';
import { FiUpload, FiX } from 'react-icons/fi';

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const UploadArea = styled.div<{ hasImage: boolean }>`
  position: relative;
  width: 100%;
  min-height: 200px;
  border: 2px dashed ${props => props.hasImage ? '#ced5d8' : '#01151d'};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  background: ${props => props.hasImage ? '#f6f9fa' : '#ffffff'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #01151d;
    background: #f6f9fa;
  }
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 6px;
  object-fit: contain;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const UploadText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-family: 'Source Sans Pro', sans-serif;
  color: #56656b;
  text-align: center;
`;

const UploadIcon = styled(FiUpload)`
  font-size: 32px;
  color: #01151d;
`;

const Input = styled.input`
  display: none;
`;

const ImageUrlInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ced5d8;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Source Sans Pro', sans-serif;
  color: #01151d;
  background: #ffffff;
  
  &:focus {
    outline: none;
    border-color: #01151d;
  }
`;

interface ImageUploaderProps {
  value?: ImageData;
  onChange: (image: ImageData | undefined) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(value?.url || '');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        onChange({
          url,
          localFile: file,
          alt: file.name,
        });
        setImageUrl(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    if (url) {
      onChange({
        url,
        alt: 'Uploaded image',
      });
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <UploadContainer>
      <UploadArea hasImage={!!value?.url} onClick={handleClick}>
        {value?.url ? (
          <>
            <ImagePreview src={value.url} alt={value.alt} />
            <RemoveButton onClick={(e) => { e.stopPropagation(); handleRemove(); }}>
              <FiX />
            </RemoveButton>
          </>
        ) : (
          <UploadText>
            <UploadIcon />
            <span>Click to upload or drag and drop</span>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>
              PNG, JPG, GIF up to 10MB
            </span>
          </UploadText>
        )}
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
        />
      </UploadArea>
      <div style={{ fontSize: '12px', color: '#56656b', textAlign: 'center' }}>
        OR
      </div>
      <ImageUrlInput
        type="text"
        placeholder="Enter image URL (for cloud storage)"
        value={imageUrl}
        onChange={(e) => handleUrlChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
      />
    </UploadContainer>
  );
};

export default ImageUploader;

