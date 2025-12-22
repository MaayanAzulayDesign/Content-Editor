import React from 'react';
import styled from 'styled-components';
import { SectionData } from '../../types';
import ImagePlaceholder from '../ImagePlaceholder';

const HeroContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1512px;
  margin: 0 auto;
  min-height: 500px;
  border-radius: 8px;
  overflow: hidden;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    border-radius: 0;
    min-height: 400px;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 104px;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 40px 24px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 400;
  font-family: 'Source Sans Pro', sans-serif;
  color: #ffffff;
  margin: 0 0 24px 0;
  line-height: 60px;
  letter-spacing: -0.84px;
  
  @media (max-width: 768px) {
    font-size: 32px;
    line-height: 40px;
    letter-spacing: -0.64px;
    margin: 0 0 16px 0;
  }
`;

const HeroText = styled.div`
  font-size: 16px;
  font-family: 'Source Sans Pro', sans-serif;
  color: #ffffff;
  margin-bottom: 32px;
  max-width: 800px;
  line-height: 24px;
  
  p {
    margin: 0 0 16px 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 24px;
    max-width: 100%;
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
  transition: all 0.2s ease;
  
  &:hover {
    background: #dfe5e8;
  }
`;

interface HeroImageTextProps {
  data: SectionData;
}

const HeroImageText: React.FC<HeroImageTextProps> = ({ data }) => {
  return (
    <HeroContainer>
      {data.heroImage?.url ? (
        <>
          <HeroImage src={data.heroImage.url} alt={data.heroImage.alt} />
          <HeroOverlay>
            {data.heroTitle && <HeroTitle>{data.heroTitle}</HeroTitle>}
            {data.heroText && (
              <HeroText dangerouslySetInnerHTML={{ __html: data.heroText }} />
            )}
            {data.heroCTA?.text && data.heroCTA?.url && (
              <CTAButton href={data.heroCTA.url}>
                {data.heroCTA.text}
                <span>→</span>
              </CTAButton>
            )}
          </HeroOverlay>
        </>
      ) : (
        <ImagePlaceholder text="Add hero image" minHeight="500px" />
      )}
    </HeroContainer>
  );
};

export default HeroImageText;

