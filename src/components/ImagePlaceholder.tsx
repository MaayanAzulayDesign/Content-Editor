import React from 'react';
import styled from 'styled-components';
import { MdAddAPhoto } from 'react-icons/md';

const PlaceholderContainer = styled.div`
  width: 100%;
  min-height: 400px;
  background: #f6f9fa;
  border: 2px dashed #ced5d8;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 14px;
  font-family: 'Source Sans Pro', sans-serif;
  text-align: center;
  padding: 40px;
  position: relative;
  
  @media (max-width: 768px) {
    min-height: 300px;
    padding: 24px;
  }
`;

const IconWrapper = styled.div`
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 48px;
    height: 48px;
    color: #9ca3af;
  }
`;

const PlaceholderText = styled.div`
  color: #9ca3af;
  font-size: 14px;
  font-family: 'Source Sans Pro', sans-serif;
`;

interface ImagePlaceholderProps {
  text?: string;
  minHeight?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ 
  text = 'Add image', 
  minHeight 
}) => {
  return (
    <PlaceholderContainer style={minHeight ? { minHeight } : undefined}>
      <IconWrapper>
        <MdAddAPhoto />
      </IconWrapper>
      <PlaceholderText>{text}</PlaceholderText>
    </PlaceholderContainer>
  );
};

export default ImagePlaceholder;

