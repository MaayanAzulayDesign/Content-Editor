import React from 'react';
import styled from 'styled-components';
import { SectionData } from '../../types';
import ImagePlaceholder from '../ImagePlaceholder';

const Container = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
  width: 100%;
  padding: 88px 60px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
`;

const Title = styled.h1`
  font-size: 72px;
  font-weight: 200;
  color: #01151d;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -1.44px;
  
  @media (max-width: 1024px) {
    font-size: 56px;
    letter-spacing: -1.12px;
  }
  
  @media (max-width: 768px) {
    font-size: 48px;
    letter-spacing: -0.96px;
  }
`;

const Separator = styled.div`
  width: 100%;
  height: 1px;
  background: #ced5d8;
  margin: 8px 0;
`;

const CTAContainer = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 8px;
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

const ImageContainer = styled.div`
  flex: 1;
  min-width: 0;
  max-width: 50%;
  
  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
  }
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
`;


interface HeroWithImageTitleCTAsProps {
  data: SectionData;
}

const HeroWithImageTitleCTAs: React.FC<HeroWithImageTitleCTAsProps> = ({ data }) => {
  const ctas = data.heroCTAs || [];
  const hasCTAs = ctas.length > 0 && ctas.some(cta => cta.text && cta.url);
  const hasTitle = data.heroTitleLarge && data.heroTitleLarge.trim() !== '';

  return (
    <Container>
      <LeftContent>
        {hasTitle ? (
          <Title>{data.heroTitleLarge}</Title>
        ) : (
          <Title style={{ color: '#9ca3af', fontStyle: 'italic' }}>Enter title...</Title>
        )}
        {hasTitle && <Separator />}
        {hasCTAs && (
          <CTAContainer>
            {ctas.filter(cta => cta.text && cta.url).map((cta, index) => (
              <CTAButton key={index} href={cta.url}>
                {cta.text}
                <span>→</span>
              </CTAButton>
            ))}
          </CTAContainer>
        )}
      </LeftContent>
      <ImageContainer>
        {data.heroImageRight?.url ? (
          <Image src={data.heroImageRight.url} alt={data.heroImageRight.alt || 'Hero image'} />
        ) : (
          <ImagePlaceholder text="Add image on the right" />
        )}
      </ImageContainer>
    </Container>
  );
};

export default HeroWithImageTitleCTAs;

