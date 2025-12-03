import React from 'react';
import styled from 'styled-components';
import { SectionData } from '../../types';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 88px 60px;
  width: 100%;
`;

const BoxesContainer = styled.div<{ count: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.count}, 1fr);
  gap: 40px;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TextBox = styled.div<{ backgroundColor: 'white' | 'light-grey' }>`
  position: relative;
  padding: 32px;
  border-radius: 12px;
  border: 1px solid #ced5d8;
  background: ${props => props.backgroundColor === 'light-grey' ? '#f6f9fa' : '#ffffff'};
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const BoxTitle = styled.h3`
  font-size: 24px;
  font-weight: 400;
  color: #01151d;
  margin: 0;
  line-height: 32px;
  letter-spacing: -0.06px;
`;

const BoxText = styled.div`
  font-size: 16px;
  color: #56656b;
  line-height: 24px;
  
  p {
    margin: 0 0 16px 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

interface TextBoxesProps {
  data: SectionData;
}

const TextBoxes: React.FC<TextBoxesProps> = ({ data }) => {
  const boxes = data.textBoxes || [];
  const count = data.textBoxesCount || boxes.length || 2;

  if (boxes.length === 0) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
          No text boxes added. Edit this section to add text boxes.
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <BoxesContainer count={count}>
        {boxes.map((box) => (
          <TextBox
            key={box.id}
            backgroundColor={box.backgroundColor || 'white'}
          >
            {box.title && <BoxTitle>{box.title}</BoxTitle>}
            {box.text && (
              <BoxText dangerouslySetInnerHTML={{ __html: box.text }} />
            )}
          </TextBox>
        ))}
      </BoxesContainer>
    </Container>
  );
};

export default TextBoxes;

