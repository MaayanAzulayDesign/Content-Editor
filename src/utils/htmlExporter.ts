import { Section, EditorState } from '../types';

const JLL_STYLES = `
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: #f6f9fa;
      color: #01151d;
      line-height: 1.5;
    }
    
    .section {
      margin-bottom: 40px;
    }
    
    .hero-container {
      position: relative;
      width: 100%;
      min-height: 500px;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .hero-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
    }
    
    .hero-overlay {
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
    }
    
    .hero-title {
      font-size: 48px;
      font-weight: 400;
      color: #ffffff;
      margin: 0 0 24px 0;
      line-height: 60px;
      letter-spacing: -0.84px;
    }
    
    .hero-text {
      font-size: 16px;
      color: #ffffff;
      margin-bottom: 32px;
      max-width: 800px;
      line-height: 24px;
    }
    
    .image-text-container {
      display: flex;
      gap: 40px;
      align-items: center;
      padding: 88px 60px;
      width: 100%;
    }
    
    .image-text-image {
      flex: 1;
      min-width: 0;
    }
    
    .image-text-image img {
      width: 100%;
      height: auto;
      border-radius: 8px;
      object-fit: cover;
    }
    
    .image-text-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 56px;
    }
    
    .section-title {
      font-size: 32px;
      font-weight: 400;
      color: #01151d;
      margin: 0;
      line-height: 40px;
      letter-spacing: -0.16px;
    }
    
    .section-text {
      font-size: 16px;
      color: #56656b;
      line-height: 24px;
    }
    
    .cta-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 24px;
      background: #01151d;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-size: 16px;
      transition: background 0.2s ease;
    }
    
    .cta-button:hover {
      background: #1a2d35;
    }
    
    .cta-button-secondary {
      background: rgba(30, 105, 118, 0.08);
      color: #01151d;
    }
    
    .cta-button-secondary:hover {
      background: rgba(30, 105, 118, 0.12);
    }
    
    .text-cta-container {
      display: flex;
      flex-direction: column;
      gap: 32px;
      padding: 88px 60px;
      text-align: center;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .cta-container {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .plain-text-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 88px 60px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .cards-container {
      display: grid;
      grid-template-columns: repeat(var(--card-count, 2), 1fr);
      gap: 24px;
      padding: 88px 60px;
    }
    
    @media (max-width: 1024px) {
      .cards-container {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    @media (max-width: 768px) {
      .cards-container {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 480px) {
      .cards-container {
        grid-template-columns: 1fr;
      }
    }
    
    .card {
      min-width: 296px;
      max-width: 296px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    .card-image {
      width: 100%;
      height: 166px;
      object-fit: cover;
    }
    
    .card-content {
      padding: 16px;
    }
    
    .card-title {
      font-size: 24px;
      font-weight: 400;
      color: #01151d;
      margin: 0 0 8px 0;
    }
    
    .map-container {
      width: 100%;
      height: 600px;
      background: #eaeff1;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 88px 60px;
    }
    
    @media (max-width: 768px) {
      .image-text-container {
        flex-direction: column;
      }
      
      .hero-overlay {
        padding: 40px 24px;
      }
      
      .hero-title {
        font-size: 32px;
        line-height: 40px;
      }
    }
  </style>
`;

function renderSection(section: Section): string {
  switch (section.type) {
    case 'hero-image-text':
      return `
        <div class="section hero-container">
          ${section.data.heroImage?.url ? `<img src="${section.data.heroImage.url}" alt="${section.data.heroImage.alt || ''}" class="hero-image" />` : ''}
          <div class="hero-overlay">
            ${section.data.heroTitle ? `<h1 class="hero-title">${section.data.heroTitle}</h1>` : ''}
            ${section.data.heroText ? `<div class="hero-text">${section.data.heroText}</div>` : ''}
            ${section.data.heroCTA?.text && section.data.heroCTA?.url ? `<a href="${section.data.heroCTA.url}" class="cta-button">${section.data.heroCTA.text} →</a>` : ''}
          </div>
        </div>
      `;

    case 'image-text-left':
    case 'image-text-right':
      const imageFirst = section.type === 'image-text-left';
      return `
        <div class="section image-text-container">
          ${imageFirst ? `
            <div class="image-text-image">
              ${section.data.image?.url ? `<img src="${section.data.image.url}" alt="${section.data.image.alt || ''}" />` : ''}
            </div>
          ` : ''}
          <div class="image-text-content">
            ${section.data.title ? `<h2 class="section-title">${section.data.title}</h2>` : ''}
            ${section.data.text ? `<div class="section-text">${section.data.text}</div>` : ''}
            ${section.data.cta?.text && section.data.cta?.url ? `<a href="${section.data.cta.url}" class="cta-button">${section.data.cta.text} →</a>` : ''}
          </div>
          ${!imageFirst ? `
            <div class="image-text-image">
              ${section.data.image?.url ? `<img src="${section.data.image.url}" alt="${section.data.image.alt || ''}" />` : ''}
            </div>
          ` : ''}
        </div>
      `;

    case 'text-cta':
      return `
        <div class="section text-cta-container">
          ${section.data.heading ? `<h2 class="section-title">${section.data.heading}</h2>` : ''}
          ${section.data.bodyText ? `<div class="section-text">${section.data.bodyText}</div>` : ''}
          ${section.data.ctas && section.data.ctas.length > 0 ? `
            <div class="cta-container">
              ${section.data.ctas.map((cta, index) => `
                <a href="${cta.url}" class="cta-button ${index > 0 ? 'cta-button-secondary' : ''}">${cta.text} →</a>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;

    case 'plain-text':
      return `
        <div class="section plain-text-container">
          ${section.data.plainTitle ? `<h2 class="section-title">${section.data.plainTitle}</h2>` : ''}
          ${section.data.plainBody ? `<div class="section-text">${section.data.plainBody}</div>` : ''}
        </div>
      `;

    case 'cards-carousel':
      const cardCount = section.data.cardCount || (section.data.cards || []).length || 2;
      return `
        <div class="section" style="padding: 88px 60px;">
          ${section.data.carouselTitle ? `<h2 class="section-title" style="font-size: 32px; font-weight: 400; color: #01151d; margin: 0 0 16px 0;">${section.data.carouselTitle}</h2>` : ''}
          ${section.data.carouselSubtitle ? `<div class="section-text" style="font-size: 16px; color: #56656b; margin: 0 0 40px 0;">${section.data.carouselSubtitle}</div>` : ''}
          <div class="cards-container" style="display: grid; grid-template-columns: repeat(${cardCount}, 1fr); gap: 24px;">
            ${(section.data.cards || []).map(card => `
              <div class="card" style="background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; height: 100%;">
                ${card.image?.url ? `
                  <div style="position: relative; width: 100%; height: 166px; overflow: hidden;">
                    <img src="${card.image.url}" alt="${card.image.alt || ''}" style="width: 100%; height: 100%; object-fit: cover;" />
                    ${card.distance ? `<div style="position: absolute; bottom: 8px; left: 8px; background: rgba(173, 216, 230, 0.95); color: #01151d; padding: 4px 12px; border-radius: 4px; font-size: 14px;">${card.distance}</div>` : ''}
                  </div>
                ` : ''}
                <div class="card-content" style="padding: 16px; display: flex; flex-direction: column; gap: 12px; flex: 1;">
                  <h3 class="card-title" style="font-size: 16px; font-weight: 400; color: #01151d; margin: 0;">${card.title || 'Card Title'}</h3>
                  ${card.subtitle ? `<div class="section-text" style="font-size: 16px; color: #56656b; line-height: 24px; flex: 1;">${card.subtitle}</div>` : ''}
                  <div style="display: flex; gap: 12px; margin-top: auto; padding-top: 4px;">
                    ${card.cta?.text && card.cta?.url ? `<a href="${card.cta.url}" style="flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 4px; padding: 14px 24px; border: 1px solid #ced5d8; background: #ffffff; color: #01151d; text-decoration: none; border-radius: 6px; font-size: 16px; min-height: 48px;">📧 ${card.cta.text || 'Contact'}</a>` : ''}
                    ${card.cta2?.text && card.cta2?.url ? `<a href="${card.cta2.url}" style="flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 4px; padding: 14px 24px; background: #01151d; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; min-height: 48px;">${card.cta2.text || 'Details'} →</a>` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

    case 'map-locations':
      const locations = section.data.locations || [];
      const locationsJSON = JSON.stringify(locations);
      const mapId = `map-${section.id.replace(/[^a-zA-Z0-9]/g, '-')}`;
      const validLocations = locations.filter((loc: any) => loc.lat && loc.lng);
      const avgLat = validLocations.length > 0 ? validLocations.reduce((sum: number, loc: any) => sum + loc.lat, 0) / validLocations.length : 51.5074;
      const avgLng = validLocations.length > 0 ? validLocations.reduce((sum: number, loc: any) => sum + loc.lng, 0) / validLocations.length : -0.1278;
      
      return `
        <div class="section">
          <div style="padding: 88px 104px; text-align: center;">
            ${section.data.mapTitle ? `<h2 class="section-title">${section.data.mapTitle}</h2>` : ''}
            ${section.data.mapDescription ? `<div class="section-text">${section.data.mapDescription}</div>` : ''}
          </div>
          <div class="map-container" id="${mapId}" style="width: 100%; height: 600px; border-radius: 8px; overflow: hidden;"></div>
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <script>
            (function() {
              const locations = ${locationsJSON};
              const mapElement = document.getElementById('${mapId}');
              
              if (mapElement && typeof L !== 'undefined') {
                const map = L.map('${mapId}', {
                  center: [${avgLat}, ${avgLng}],
                  zoom: ${validLocations.length === 1 ? 15 : 10},
                });
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                  maxZoom: 19,
                }).addTo(map);
                
                const bounds = L.latLngBounds([]);
                
                locations.forEach(function(location) {
                  if (location.lat && location.lng) {
                    const customIcon = L.divIcon({
                      className: 'custom-marker',
                      html: '<div style="position: relative; display: flex; flex-direction: column; align-items: center;">' +
                        (location.name ? '<div style="background: #4c5b62; border: 1px solid #ffffff; color: #ffffff; padding: 8px 12px; border-radius: 6px; font-family: \'Source Sans Pro\', sans-serif; font-size: 14px; font-weight: 400; line-height: 20px; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2); pointer-events: none; position: relative;">' +
                          location.name +
                          '<div style="position: absolute; bottom: -9px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #4c5b62;"></div>' +
                          '<div style="position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 9px solid transparent; border-right: 9px solid transparent; border-top: 9px solid #ffffff; z-index: -1;"></div>' +
                          '</div>' : '') +
                        '</div>',
                      iconSize: [200, 50],
                      iconAnchor: [100, 50],
                    });
                    
                    const marker = L.marker([location.lat, location.lng], {
                      icon: customIcon,
                      title: location.name || 'Location',
                    });
                    
                    let popupContent = '<div style="padding: 16px; min-width: 220px;">';
                    if (location.name) {
                      popupContent += '<h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 400; color: #01151d;">' + location.name + '</h3>';
                    }
                    if (location.propertyCount !== undefined && location.propertyCount !== null) {
                      popupContent += '<div style="margin: 0 0 16px 0; font-size: 16px; color: #56656b; font-weight: 500;">' +
                        location.propertyCount + ' ' + (location.propertyCount === 1 ? 'Property' : 'Properties') +
                        '</div>';
                    }
                    if (location.cta && location.cta.text && location.cta.url) {
                      popupContent += '<a href="' + location.cta.url + '" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; background: #01151d; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 400;">' + location.cta.text + '</a>';
                    }
                    popupContent += '</div>';
                    
                    marker.bindPopup(popupContent, {
                      offset: [0, -10],
                    });
                    marker.addTo(map);
                    bounds.extend([location.lat, location.lng]);
                  }
                });
                
                if (validLocations.length > 1) {
                  map.fitBounds(bounds, { padding: [50, 50] });
                }
              }
            })();
          </script>
          <style>
            #${mapId} .custom-marker {
              background: transparent !important;
              border: none !important;
            }
            #${mapId} .leaflet-popup-content-wrapper {
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
          </style>
        </div>
      `;

    case 'text-boxes':
      const boxes = section.data.textBoxes || [];
      const boxCount = section.data.textBoxesCount || boxes.length || 2;
      return `
        <div class="section" style="padding: 88px 104px;">
          <div style="display: grid; grid-template-columns: repeat(${boxCount}, 1fr); gap: 40px;">
            ${boxes.map(box => `
              <div style="padding: 32px; border-radius: 12px; border: 1px solid #ced5d8; background: ${box.backgroundColor === 'light-grey' ? '#f6f9fa' : '#ffffff'};">
                ${box.title ? `<h3 style="font-size: 24px; font-weight: 400; color: #01151d; margin: 0 0 16px 0; line-height: 32px;">${box.title}</h3>` : ''}
                ${box.text ? `<div class="section-text">${box.text}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;

    default:
      return '';
  }
}

export function exportToHTML(
  sections: Section[], 
  format: 'standalone' | 'template' | 'draft' = 'standalone',
  editorState?: EditorState
): string {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const sectionsHTML = sortedSections.map(renderSection).join('\n');

  if (format === 'standalone' || format === 'draft') {
    // Include editor state in draft format for loading later
    const stateScript = format === 'draft' && editorState
      ? `<script type="application/json" data-editor-state>${JSON.stringify(editorState)}</script>`
      : '';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JLL Content Page</title>
  ${JLL_STYLES}
</head>
<body>
  <div style="max-width: 1512px; margin: 0 auto; background: #ffffff;">
    ${sectionsHTML}
  </div>
  ${stateScript}
</body>
</html>
    `.trim();

    if (format === 'draft') {
      // Return HTML string for draft saving
      return html;
    }

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jll-content-page.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return html;
  } else {
    // Template format - just the sections with placeholders
    const template = `
<!-- JLL Content Template -->
<!-- Replace this with your page structure -->
${sectionsHTML}
    `.trim();

    const blob = new Blob([template], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jll-content-template.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return template;
  }
}

