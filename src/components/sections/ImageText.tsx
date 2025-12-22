import React from 'react';
import styled from 'styled-components';
import { SectionData } from '../../types';
import ImagePlaceholder from '../ImagePlaceholder';

const Container = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
  width: 100%;
  max-width: 1512px;
  margin: 0 auto;
  padding: 88px 104px;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 40px 24px;
    gap: 32px;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 56px;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 24px 0;
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

const Text = styled.div`
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

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  background: #eaeff1;
  color: #34404b;
  text-decoration: none;
  border-radius: 6px;
  font-size: 16px;
  width: fit-content;
  transition: all 0.2s ease;
  
  &:hover {
    background: #dfe5e8;
  }
`;

interface ImageTextProps {
  data: SectionData;
  imagePosition: 'left' | 'right';
}

const ImageText: React.FC<ImageTextProps> = ({ data, imagePosition }) => {
  const imageSection = (
    <ImageContainer>
      {data.image?.url ? (
        <Image src={data.image.url} alt={data.image.alt || 'Section image'} />
      ) : (
        <ImagePlaceholder text="Add image" />
      )}
    </ImageContainer>
  );

  const contentSection = (
    <ContentContainer>
      {data.title && <Title>{data.title}</Title>}
      {data.text && <Text dangerouslySetInnerHTML={{ __html: data.text }} />}
      {data.cta?.text && data.cta?.url && (
        <CTAButton href={data.cta.url}>
          {data.cta.text}
          <span>→</span>
        </CTAButton>
      )}
    </ContentContainer>
  );

  return (
    <Container>
      {imagePosition === 'left' ? (
        <>
          {imageSection}
          {contentSection}
        </>
      ) : (
        <>
          {contentSection}
          {imageSection}
        </>
      )}
    </Container>
  );
};

export default ImageText;

