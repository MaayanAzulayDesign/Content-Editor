import React, { useState } from 'react';
import styled from 'styled-components';
import { Section } from '../types';
import { generateSitefinityInstructions } from '../utils/sitefinityInstructions';

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
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eaeff1;
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

const InstructionsContent = styled.div`
  flex: 1;
  overflow-y: auto;
  font-family: 'Source Sans Pro', sans-serif;
  color: #01151d;
  line-height: 1.6;
  
  h1 {
    font-size: 28px;
    font-weight: 400;
    margin: 0 0 16px 0;
    color: #01151d;
  }
  
  h2 {
    font-size: 20px;
    font-weight: 400;
    margin: 32px 0 16px 0;
    color: #01151d;
  }
  
  h3 {
    font-size: 18px;
    font-weight: 400;
    margin: 24px 0 12px 0;
    color: #01151d;
  }
  
  p {
    margin: 0 0 12px 0;
    font-size: 16px;
    color: #56656b;
  }
  
  ul, ol {
    margin: 12px 0;
    padding-left: 24px;
    
    li {
      margin: 8px 0;
      font-size: 16px;
      color: #56656b;
    }
  }
  
  code {
    background: #f6f9fa;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    color: #01151d;
  }
  
  pre {
    background: #f6f9fa;
    border: 1px solid #eaeff1;
    border-radius: 6px;
    padding: 16px;
    overflow-x: auto;
    margin: 16px 0;
    
    code {
      background: none;
      padding: 0;
      font-size: 14px;
      color: #01151d;
      white-space: pre;
    }
  }
  
  strong {
    font-weight: 600;
    color: #01151d;
  }
  
  em {
    font-style: italic;
  }
  
  hr {
    border: none;
    border-top: 1px solid #eaeff1;
    margin: 24px 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eaeff1;
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
  ` : `
    background: rgba(30, 105, 118, 0.08);
    color: #01151d;
    
    &:hover {
      background: rgba(30, 105, 118, 0.12);
    }
  `}
`;

const CopyButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose, sections }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) {
    return null;
  }

  const instructions = generateSitefinityInstructions(sections);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(instructions);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy instructions:', error);
      alert('Failed to copy instructions. Please select and copy manually.');
    }
  };

  // Convert markdown-like formatting to HTML for display
  const formatInstructions = (text: string): string => {
    let formatted = text;
    
    // Convert code blocks first (before other processing)
    formatted = formatted.replace(/```([\s\S]*?)```/g, (match, code) => {
      const escapedCode = code
        .trim()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<pre><code>${escapedCode}</code></pre>`;
    });
    
    // Split into lines for processing
    const lines = formatted.split('\n');
    const output: string[] = [];
    let inList = false;
    let listItems: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Skip empty lines (they'll be handled as paragraph breaks)
      if (!trimmed) {
        if (inList && listItems.length > 0) {
          output.push(`<ul>${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
        }
        output.push('');
        continue;
      }
      
      // Headers
      if (trimmed.startsWith('### ')) {
        if (inList && listItems.length > 0) {
          output.push(`<ul>${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
        }
        output.push(`<h3>${trimmed.substring(4)}</h3>`);
        continue;
      }
      if (trimmed.startsWith('## ')) {
        if (inList && listItems.length > 0) {
          output.push(`<ul>${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
        }
        output.push(`<h2>${trimmed.substring(3)}</h2>`);
        continue;
      }
      if (trimmed.startsWith('# ')) {
        if (inList && listItems.length > 0) {
          output.push(`<ul>${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
        }
        output.push(`<h1>${trimmed.substring(2)}</h1>`);
        continue;
      }
      
      // Horizontal rules
      if (trimmed === '---') {
        if (inList && listItems.length > 0) {
          output.push(`<ul>${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
        }
        output.push('<hr>');
        continue;
      }
      
      // Code blocks (already processed, skip)
      if (trimmed.startsWith('<pre>')) {
        if (inList && listItems.length > 0) {
          output.push(`<ul>${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
        }
        output.push(trimmed);
        continue;
      }
      
      // List items
      const listMatch = trimmed.match(/^[-*] (.+)$/);
      if (listMatch) {
        inList = true;
        const itemText = formatInlineMarkdown(listMatch[1]);
        listItems.push(`<li>${itemText}</li>`);
        continue;
      }
      
      // Numbered list items
      const numberedMatch = trimmed.match(/^\d+\. (.+)$/);
      if (numberedMatch) {
        inList = true;
        const itemText = formatInlineMarkdown(numberedMatch[1]);
        listItems.push(`<li>${itemText}</li>`);
        continue;
      }
      
      // Regular paragraph
      if (inList && listItems.length > 0) {
        output.push(`<ul>${listItems.join('')}</ul>`);
        listItems = [];
        inList = false;
      }
      
      const formattedLine = formatInlineMarkdown(trimmed);
      output.push(`<p>${formattedLine}</p>`);
    }
    
    // Close any remaining list
    if (inList && listItems.length > 0) {
      output.push(`<ul>${listItems.join('')}</ul>`);
    }
    
    return output.join('\n');
  };
  
  // Format inline markdown (bold, italic, code)
  const formatInlineMarkdown = (text: string): string => {
    let formatted = text;
    
    // Convert bold first (before italic)
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Convert italic (single asterisks that aren't part of bold)
    formatted = formatted.replace(/\*([^*]+?)\*/g, '<em>$1</em>');
    
    return formatted;
  };

  const formattedContent = formatInstructions(instructions);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Sitefinity Implementation Instructions</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <InstructionsContent dangerouslySetInnerHTML={{ __html: formattedContent }} />

        <ButtonGroup>
          <Button onClick={onClose}>Close</Button>
          <CopyButton variant="primary" onClick={handleCopy}>
            {copied ? '✓ Copied!' : 'Copy Instructions'}
          </CopyButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default InstructionsModal;

