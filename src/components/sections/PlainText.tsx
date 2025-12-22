import React from 'react';
import styled from 'styled-components';
import { SectionData } from '../../types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 88px 104px;
  max-width: 1512px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 40px 24px;
    gap: 20px;
  }
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 400;
  color: #01151d;
  margin: 0;
  line-height: 40px;
  letter-spacing: -0.16px;
`;

const Body = styled.div`
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

interface PlainTextProps {
  data: SectionData;
}

const PlainText: React.FC<PlainTextProps> = ({ data }) => {
  return (
    <Container>
      {data.plainTitle && <Title>{data.plainTitle}</Title>}
      {data.plainBody && (
        <Body dangerouslySetInnerHTML={{ __html: data.plainBody }} />
      )}
    </Container>
  );
};

export default PlainText;

