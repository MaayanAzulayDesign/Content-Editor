import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { SectionData } from '../../types';
import { useEditor } from '../../context/EditorContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in webpack/vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 88px 104px;
  max-width: 1512px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 40px 24px;
    gap: 32px;
  }
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
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background: #eaeff1;
  box-sizing: border-box;

  .leaflet-container {
    height: 100%;
    width: 100%;
    border-radius: 8px;
  }
  
  @media (max-width: 768px) {
    height: 400px;
    border-radius: 0;
  }
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #56656b;
  z-index: 10;
  background: #ffffff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const LoadingMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #56656b;
  z-index: 10;
  background: #ffffff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

interface MapLocationsProps {
  data: SectionData;
  sectionId: string;
}

const MapLocations: React.FC<MapLocationsProps> = ({ data, sectionId }) => {
  const locations = data.locations || [];
  const { setCurrentSection } = useEditor();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    let isMounted = true;

    try {
      // Initialize map
      const map = L.map(mapRef.current, {
        center: [51.5074, -0.1278], // Default to London
        zoom: 10,
        zoomControl: true,
      });

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      setIsMapLoaded(true);
      setMapError(null);

      // Calculate center and bounds if locations exist
      if (locations.length > 0) {
        const validLocations = locations.filter(loc => loc.lat && loc.lng);
        
        if (validLocations.length > 0) {
          // Calculate center
          const avgLat = validLocations.reduce((sum, loc) => sum + loc.lat, 0) / validLocations.length;
          const avgLng = validLocations.reduce((sum, loc) => sum + loc.lng, 0) / validLocations.length;
          
          map.setView([avgLat, avgLng], validLocations.length === 1 ? 15 : 12);

          // Clear existing markers
          markersRef.current.forEach(marker => map.removeLayer(marker));
          markersRef.current = [];

          // Create bounds for fitting
          const bounds = L.latLngBounds([]);

          // Add markers for each location
          validLocations.forEach((location) => {
            const marker = L.marker([location.lat, location.lng], {
              title: location.name || 'Location',
            });

            // Create custom icon matching Figma design - tooltip style with arrow
            const customIcon = L.divIcon({
              className: 'custom-marker',
              html: `
                <div style="
                  position: relative;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                ">
                  ${location.name ? `
                    <div style="
                      background: #4c5b62;
                      border: 1px solid #ffffff;
                      color: #ffffff;
                      padding: 8px 12px;
                      border-radius: 6px;
                      font-family: 'Source Sans Pro', sans-serif;
                      font-size: 14px;
                      font-weight: 400;
                      line-height: 20px;
                      white-space: nowrap;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                      pointer-events: none;
                      position: relative;
                    ">
                      ${location.name}
                      <div style="
                        position: absolute;
                        bottom: -9px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 0;
                        height: 0;
                        border-left: 8px solid transparent;
                        border-right: 8px solid transparent;
                        border-top: 8px solid #4c5b62;
                      "></div>
                      <div style="
                        position: absolute;
                        bottom: -10px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 0;
                        height: 0;
                        border-left: 9px solid transparent;
                        border-right: 9px solid transparent;
                        border-top: 9px solid #ffffff;
                        z-index: -1;
                      "></div>
                    </div>
                  ` : ''}
                </div>
              `,
              iconSize: [200, 50],
              iconAnchor: [100, 50],
            });

            marker.setIcon(customIcon);

            // Create popup content with property count and CTA
            let popupContent = '<div style="padding: 16px; min-width: 220px;">';
            if (location.name) {
              popupContent += `<h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 400; color: #01151d;">${location.name}</h3>`;
            }
            if (location.propertyCount !== undefined && location.propertyCount !== null) {
              popupContent += `<div style="margin: 0 0 16px 0; font-size: 16px; color: #56656b; font-weight: 500;">
                ${location.propertyCount} ${location.propertyCount === 1 ? 'Property' : 'Properties'}
              </div>`;
            }
            if (location.cta?.text && location.cta?.url) {
              popupContent += `<a href="${location.cta.url}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; background: #01151d; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 400; transition: background 0.2s ease;">${location.cta.text}</a>`;
            }
            popupContent += '</div>';

            marker.bindPopup(popupContent, {
              className: 'custom-popup',
              offset: [0, -10],
            });

            // Show popup on hover
            marker.on('mouseover', () => {
              marker.openPopup();
            });

            marker.on('mouseout', () => {
              // Keep popup open for better UX
            });

            // Add click event to open editor
            marker.on('click', () => {
              setCurrentSection(sectionId);
            });

            marker.addTo(map);
            markersRef.current.push(marker);
            bounds.extend([location.lat, location.lng]);
          });

          // Fit bounds to show all markers if multiple
          if (validLocations.length > 1) {
            map.fitBounds(bounds, { padding: [50, 50] });
          }
        } else {
          // No valid locations, show default view
          map.setView([51.5074, -0.1278], 10);
        }
      } else {
        // No locations, show default view
        map.setView([51.5074, -0.1278], 10);
      }

      // Add click handler to map to open editor
      map.on('click', () => {
        setCurrentSection(sectionId);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      if (isMounted) {
        setMapError('Error initializing map. Please try again.');
        setIsMapLoaded(false);
      }
    }

    return () => {
      isMounted = false;
      // Cleanup map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
    };
  }, [locations, sectionId, setCurrentSection]);

  const handleMapClick = () => {
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
        <MapWrapper ref={mapRef} />
        {mapError && (
          <ErrorMessage>
            <p>{mapError}</p>
            <p style={{ fontSize: '14px', marginTop: '8px', color: '#9ca3af' }}>
              {locations.length === 0 && 'Add locations in the editor to see them on the map.'}
            </p>
          </ErrorMessage>
        )}
        {!isMapLoaded && !mapError && (
          <LoadingMessage>
            <p>Loading map...</p>
          </LoadingMessage>
        )}
      </MapContainer>
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </Container>
  );
};

export default MapLocations;
