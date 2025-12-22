import React from 'react';
import styled from 'styled-components';
import { useEditor } from '../context/EditorContext';

const SubheaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 104px;
  background: #ffffff;
  border-bottom: 1px solid #eaeff1;
  gap: 0;
`;

const URLContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 14px;
  background: #f6f9fa;
  border: 1px solid #eaeff1;
  border-radius: 3.6px;
  overflow: hidden;
  width: 100%;
  max-width: 480px;
  height: 34px;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: #09779e;
    box-shadow: 0 0 0 1.8px rgba(9, 119, 158, 0.1);
  }
`;

const BaseURL = styled.div`
  color: #b7c0c3;
  background: #eaeff1;
  padding: 4.8px 7.2px;
  user-select: none;
  pointer-events: none;
  font-weight: 400;
  font-size: 14px;
  border-right: 1px solid #dfe5e8;
  white-space: nowrap;
  display: flex;
  align-items: center;
`;

const PathInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 14px;
  color: #01151d;
  padding: 4.8px 7.2px;
  flex: 1;
  min-width: 90px;
  transition: all 0.2s ease;

  &::placeholder {
    color: #b7c0c3;
    font-style: italic;
  }

  &:focus {
    background: #ffffff;
  }
`;

const PageSubheader: React.FC = () => {
  const { state, updatePagePath } = useEditor();
  const baseURL = 'https://residential.jll.co.uk';
  const path = state.pagePath || '';

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newPath = e.target.value.trim();
    // Remove leading slash if user types it (we'll add it automatically)
    if (newPath.startsWith('/')) {
      newPath = newPath.substring(1);
    }
    // Add leading slash for display
    if (newPath) {
      newPath = '/' + newPath;
    }
    updatePagePath(newPath);
  };

  // Update document title
  React.useEffect(() => {
    const fullPath = path ? `${baseURL}${path}` : baseURL;
    document.title = `Resi Studio - ${fullPath}`;
  }, [path, baseURL]);

  // Display path without leading slash in input, but store with it
  const displayPath = path.startsWith('/') ? path.substring(1) : path;

  return (
    <SubheaderContainer>
      <URLContainer>
        <BaseURL>{baseURL}/</BaseURL>
        <PathInput
          id="page-path-input"
          type="text"
          value={displayPath}
          onChange={handlePathChange}
          placeholder="page-title"
        />
      </URLContainer>
    </SubheaderContainer>
  );
};

export default PageSubheader;

