import React from 'react';
import styled from 'styled-components';
import { SectionData } from '../../types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 88px 60px;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Heading = styled.h2`
  font-size: 32px;
  font-weight: 400;
  color: #01151d;
  margin: 0;
  line-height: 40px;
  letter-spacing: -0.16px;
`;

const BodyText = styled.div`
  font-size: 16px;
  color: #56656b;
  line-height: 24px;
  max-width: 800px;
  margin: 0 auto;
  
  p {
    margin: 0 0 16px 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const CTAContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const CTAButton = styled.a<{ variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: 6px;
  font-size: 16px;
  text-decoration: none;
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

interface TextCTAProps {
  data: SectionData;
}

const TextCTA: React.FC<TextCTAProps> = ({ data }) => {
  return (
    <Container>
      {data.heading && <Heading>{data.heading}</Heading>}
      {data.bodyText && (
        <BodyText dangerouslySetInnerHTML={{ __html: data.bodyText }} />
      )}
      {data.ctas && data.ctas.length > 0 && (
        <CTAContainer>
          {data.ctas.map((cta, index) => (
            <CTAButton
              key={index}
              href={cta.url}
              variant={cta.variant || (index === 0 ? 'primary' : 'secondary')}
            >
              {cta.text}
              <span>→</span>
            </CTAButton>
          ))}
        </CTAContainer>
      )}
    </Container>
  );
};

export default TextCTA;

