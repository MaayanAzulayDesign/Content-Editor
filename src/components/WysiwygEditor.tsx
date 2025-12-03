import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';

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
    border-color: #ced5d8;
  }
  
  .ql-container {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    border-color: #ced5d8;
  }
  
  .ql-editor.ql-blank::before {
    color: #9ca3af;
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
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ],
  }), []);

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

