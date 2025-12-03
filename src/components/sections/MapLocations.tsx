import React from 'react';
import styled from 'styled-components';
import { SectionData } from '../../types';
import { useEditor } from '../../context/EditorContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 88px 60px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 852px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 400;
  color: #01151d;
  margin: 0;
  line-height: 40px;
  letter-spacing: -0.16px;
`;

const Description = styled.div`
  font-size: 16px;
  color: #56656b;
  line-height: 24px;
  
  p {
    margin: 0;
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 600px;
  background: #eaeff1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  cursor: crosshair;
  
  &:hover {
    background: #dfe5e8;
  }
`;

const MapPlaceholder = styled.div`
  text-align: center;
  color: #9ca3af;
  font-size: 16px;
`;

const LocationPins = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Pin = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  width: 24px;
  height: 24px;
  background: #de0614;
  border-radius: 50%;
  border: 3px solid #ffffff;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.2);
  }
`;

interface MapLocationsProps {
  data: SectionData;
  sectionId: string;
}

const MapLocations: React.FC<MapLocationsProps> = ({ data, sectionId }) => {
  const locations = data.locations || [];
  const { setCurrentSection } = useEditor();

  const handleMapClick = () => {
    setCurrentSection(sectionId);
  };

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSection(sectionId);
  };

  return (
    <Container>
      <Header>
        {data.mapTitle && <Title>{data.mapTitle}</Title>}
        {data.mapDescription && (
          <Description dangerouslySetInnerHTML={{ __html: data.mapDescription }} />
        )}
      </Header>
      <MapContainer onClick={handleMapClick}>
        <MapPlaceholder>
          Click on map to add location coordinates
          <br />
          <small>Locations: {locations.length}</small>
        </MapPlaceholder>
        <LocationPins>
          {locations.map((location) => (
            <Pin
              key={location.id}
              x={50 + (location.lng % 20)}
              y={50 + (location.lat % 20)}
              title={location.name}
              onClick={handlePinClick}
            />
          ))}
        </LocationPins>
      </MapContainer>
    </Container>
  );
};

export default MapLocations;

