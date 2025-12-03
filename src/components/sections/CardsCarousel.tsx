import React from 'react';
import styled from 'styled-components';
import { SectionData } from '../../types';
import { FiMail, FiArrowRight } from 'react-icons/fi';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 88px 60px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 400;
  color: #01151d;
  margin: 0;
  line-height: 40px;
  letter-spacing: -0.16px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #56656b;
  margin: 0;
  line-height: 24px;
`;

const CardsGrid = styled.div<{ count: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.count}, 1fr);
  gap: 24px;
  width: 100%;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(${props => Math.min(props.count, 3)}, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(${props => Math.min(props.count, 2)}, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  position: relative;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CardImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 166px;
  overflow: hidden;
  background: #f6f9fa;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DistanceBadge = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(173, 216, 230, 0.95);
  backdrop-filter: blur(8px);
  color: #01151d;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;

const CardContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 400;
  color: #01151d;
  margin: 0;
  line-height: 24px;
`;

const CardSubtitle = styled.p`
  font-size: 16px;
  color: #56656b;
  margin: 0;
  line-height: 24px;
  white-space: pre-line;
  flex: 1;
`;

const CTAContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: auto;
  padding-top: 4px;
`;

const CTAButton = styled.a`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 14px 24px;
  border: 1px solid #ced5d8;
  background: #ffffff;
  color: #01151d;
  text-decoration: none;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.2s ease;
  min-height: 48px;
  
  &:hover {
    border-color: #01151d;
    background: #f6f9fa;
  }
`;

const PrimaryCTA = styled(CTAButton)`
  background: #01151d;
  color: #ffffff;
  border-color: #01151d;
  
  &:hover {
    background: #1a2d35;
    border-color: #1a2d35;
  }
`;

interface CardsCarouselProps {
  data: SectionData;
}

const CardsCarousel: React.FC<CardsCarouselProps> = ({ data }) => {
  const cards = data.cards || [];
  const count = data.cardCount || cards.length || 2;

  if (cards.length === 0) {
    return (
      <Container>
        <Header>
          {data.carouselTitle && <Title>{data.carouselTitle}</Title>}
          {data.carouselSubtitle && <Subtitle>{data.carouselSubtitle}</Subtitle>}
        </Header>
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
          No cards added. Edit this section to add cards.
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        {data.carouselTitle && <Title>{data.carouselTitle}</Title>}
        {data.carouselSubtitle && <Subtitle>{data.carouselSubtitle}</Subtitle>}
      </Header>
      <CardsGrid count={count}>
        {cards.map((card) => (
          <Card key={card.id}>
            {card.image?.url && (
              <CardImageContainer>
                <CardImage src={card.image.url} alt={card.image.alt || card.title} />
                {card.distance && (
                  <DistanceBadge>{card.distance}</DistanceBadge>
                )}
              </CardImageContainer>
            )}
            <CardContent>
              <CardTitle>{card.title || 'Card Title'}</CardTitle>
              {card.subtitle && <CardSubtitle>{card.subtitle}</CardSubtitle>}
              <CTAContainer>
                {card.cta?.text && card.cta?.url && (
                  <CTAButton href={card.cta.url}>
                    <FiMail size={20} />
                    {card.cta.text || 'Contact'}
                  </CTAButton>
                )}
                {card.cta2?.text && card.cta2?.url && (
                  <PrimaryCTA href={card.cta2.url}>
                    {card.cta2.text || 'Details'}
                    <FiArrowRight size={20} />
                  </PrimaryCTA>
                )}
              </CTAContainer>
            </CardContent>
          </Card>
        ))}
      </CardsGrid>
    </Container>
  );
};

export default CardsCarousel;
