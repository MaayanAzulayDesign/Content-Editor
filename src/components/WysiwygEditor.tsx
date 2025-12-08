import React, { useMemo, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';

// Figma color palette from design system
const FIGMA_COLORS = [
  '#01151d', // surface/base/persistent - Dark navy
  '#4c5b62', // surface/interaction/idle - Dark gray
  '#b7c0c3', // icon/base/reversedSubdued - Medium gray
  '#eaeff1', // surface/base/secondary - Light gray
  '#dfe5e8', // surface/utilities/skeleton - Very light gray
  '#ffffff', // surface/base/default - White
  '#09779e', // surface/interaction/default - Blue
  '#2fa0c7', // surface/interaction/bright - Bright blue
  '#d2f4ff', // surface/interaction/subdued - Light blue
  '#2245b0', // tonal/royal/strong - Royal blue
  '#c8d3f8', // tonal/royal/shade1 - Light periwinkle
  '#eaeefc', // tonal/royal/subdued - Very light blue
  '#035a45', // tonal/watercourse/strong - Dark green
  '#08a981', // tonal/watercourse/shade2 - Green
  '#c9f9ed', // tonal/watercourse/subdued - Light mint
  '#6d19c1', // tonal/lilac/strong - Purple
  '#b17ee5', // tonal/lilac/shade2 - Light purple
  '#f3ebfc', // tonal/lilac/subdued - Very light purple
  '#f7ece3', // surface/base/alternative - Beige
];

const EditorContainer = styled.div`
  .ql-container {
    font-size: 16px;
    font-family: 'Source Sans Pro', sans-serif;
    min-height: 150px;
  }
  
  .ql-editor {
    min-height: 150px;
  }
  
  .ql-toolbar {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    border-color: #b7c0c3;
  }
  
  .ql-container {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    border-color: #b7c0c3;
  }
  
  .ql-editor.ql-blank::before {
    color: #b7c0c3;
    font-style: normal;
  }
`;

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({ value, onChange, placeholder }) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': FIGMA_COLORS }, { 'background': FIGMA_COLORS }],
      ['link'],
      ['clean']
    ],
  }), []);

  // Update Quill's color picker after component mounts
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .ql-picker-label[data-label]::before,
      .ql-picker-item[data-label]::before {
        content: attr(data-label);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <EditorContainer>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || 'Enter text...'}
      />
    </EditorContainer>
  );
};

export default WysiwygEditor;

