import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useEditor } from '../context/EditorContext';
import { SectionData, CTA } from '../types';
import WysiwygEditor from './WysiwygEditor';
import ImageUploader from './ImageUploader';
import { FiX } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

const DrawerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
`;

const Drawer = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 400px;
  background: #ffffff;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

const DrawerHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #eaeff1;
`;

const DrawerTitle = styled.h2`
  font-size: 20px;
  font-weight: 400;
  color: #01151d;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #56656b;
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: #01151d;
  }
`;

const DrawerContent = styled.div`
  position: relative;
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 400;
  color: #01151d;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #ced5d8;
  border-radius: 6px;
  font-size: 16px;
  color: #01151d;
  background: #ffffff;
  
  &:focus {
    outline: none;
    border-color: #01151d;
  }
`;


const CTAFields = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #f6f9fa;
  border-radius: 6px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #01151d;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 16px;
  
  &:hover {
    background: #1a2d35;
  }
`;

const SectionEditorDrawer: React.FC = () => {
  const { state, updateSection, closeDrawer, deleteSection } = useEditor();
  const { currentSectionId, sections, isDrawerOpen } = state;

  const currentSection = sections.find(s => s.id === currentSectionId);

  if (!isDrawerOpen || !currentSection) return null;

  const [formData, setFormData] = useState<SectionData>(currentSection.data);

  useEffect(() => {
    const data = currentSection.data;
    // Initialize cardCount if not set but cards exist
    if (currentSection.type === 'cards-carousel' && !data.cardCount && data.cards) {
      const cardCount = data.cards.length || 1;
      setFormData({
        ...data,
        cardCount,
      });
    } else {
      setFormData(data);
    }
  }, [currentSection.id, currentSection.type, currentSection.data]);

  const handleChange = (field: keyof SectionData, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    updateSection(currentSection.id, updated);
  };

  const handleCTAChange = (index: number, field: keyof CTA, value: string) => {
    const ctas = formData.ctas || [];
    const updated = [...ctas];
    updated[index] = { ...updated[index], [field]: value };
    handleChange('ctas', updated);
  };

  const handleAddCTA = () => {
    const ctas = formData.ctas || [];
    handleChange('ctas', [...ctas, { text: '', url: '' }]);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this section?')) {
      deleteSection(currentSection.id);
      closeDrawer();
    }
  };

  const renderFields = () => {
    switch (currentSection.type) {
      case 'hero-image-text':
        return (
          <>
            <FormGroup>
              <Label>Hero Image</Label>
              <ImageUploader
                value={formData.heroImage}
                onChange={(image) => handleChange('heroImage', image)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Title</Label>
              <Input
                value={formData.heroTitle || ''}
                onChange={(e) => handleChange('heroTitle', e.target.value)}
                placeholder="Enter title"
              />
            </FormGroup>
            <FormGroup>
              <Label>Text</Label>
              <WysiwygEditor
                value={formData.heroText || ''}
                onChange={(value) => handleChange('heroText', value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>CTA Text</Label>
              <Input
                value={formData.heroCTA?.text || ''}
                onChange={(e) => handleChange('heroCTA', { ...formData.heroCTA, text: e.target.value })}
                placeholder="Button text"
              />
            </FormGroup>
            <FormGroup>
              <Label>CTA URL</Label>
              <Input
                value={formData.heroCTA?.url || ''}
                onChange={(e) => handleChange('heroCTA', { ...formData.heroCTA, url: e.target.value })}
                placeholder="https://..."
              />
            </FormGroup>
          </>
        );

      case 'image-text-left':
      case 'image-text-right':
        return (
          <>
            <FormGroup>
              <Label>Image</Label>
              <ImageUploader
                value={formData.image}
                onChange={(image) => handleChange('image', image)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Title</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter title"
              />
            </FormGroup>
            <FormGroup>
              <Label>Text</Label>
              <WysiwygEditor
                value={formData.text || ''}
                onChange={(value) => handleChange('text', value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>CTA Text</Label>
              <Input
                value={formData.cta?.text || ''}
                onChange={(e) => handleChange('cta', { ...formData.cta, text: e.target.value })}
                placeholder="Button text"
              />
            </FormGroup>
            <FormGroup>
              <Label>CTA URL</Label>
              <Input
                value={formData.cta?.url || ''}
                onChange={(e) => handleChange('cta', { ...formData.cta, url: e.target.value })}
                placeholder="https://..."
              />
            </FormGroup>
          </>
        );

      case 'text-cta':
        return (
          <>
            <FormGroup>
              <Label>Heading</Label>
              <Input
                value={formData.heading || ''}
                onChange={(e) => handleChange('heading', e.target.value)}
                placeholder="Enter heading"
              />
            </FormGroup>
            <FormGroup>
              <Label>Body Text</Label>
              <WysiwygEditor
                value={formData.bodyText || ''}
                onChange={(value) => handleChange('bodyText', value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>CTAs</Label>
              {(formData.ctas || []).map((cta, index) => (
                <CTAFields key={index}>
                  <FormGroup>
                    <Label>CTA {index + 1} Text</Label>
                    <Input
                      value={cta.text}
                      onChange={(e) => handleCTAChange(index, 'text', e.target.value)}
                      placeholder="Button text"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>CTA {index + 1} URL</Label>
                    <Input
                      value={cta.url}
                      onChange={(e) => handleCTAChange(index, 'url', e.target.value)}
                      placeholder="https://..."
                    />
                  </FormGroup>
                </CTAFields>
              ))}
              <Button onClick={handleAddCTA}>Add CTA</Button>
            </FormGroup>
          </>
        );

      case 'plain-text':
        return (
          <>
            <FormGroup>
              <Label>Title</Label>
              <Input
                value={formData.plainTitle || ''}
                onChange={(e) => handleChange('plainTitle', e.target.value)}
                placeholder="Enter title"
              />
            </FormGroup>
            <FormGroup>
              <Label>Body Text</Label>
              <WysiwygEditor
                value={formData.plainBody || ''}
                onChange={(value) => handleChange('plainBody', value)}
              />
            </FormGroup>
          </>
        );

      case 'map-locations':
        return (
          <>
            <FormGroup>
              <Label>Section Title</Label>
              <Input
                value={formData.mapTitle || ''}
                onChange={(e) => handleChange('mapTitle', e.target.value)}
                placeholder="Enter section title"
              />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <WysiwygEditor
                value={formData.mapDescription || ''}
                onChange={(value) => handleChange('mapDescription', value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Locations</Label>
              {(formData.locations || []).map((location, index) => (
                <CTAFields key={location.id}>
                  <FormGroup>
                    <Label>Location {index + 1} Name</Label>
                    <Input
                      value={location.name}
                      onChange={(e) => {
                        const locations = [...(formData.locations || [])];
                        locations[index] = { ...location, name: e.target.value };
                        handleChange('locations', locations);
                      }}
                      placeholder="Location name"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Address</Label>
                    <Input
                      value={location.address}
                      onChange={(e) => {
                        const locations = [...(formData.locations || [])];
                        locations[index] = { ...location, address: e.target.value };
                        handleChange('locations', locations);
                      }}
                      placeholder="Full address"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Latitude</Label>
                    <Input
                      type="number"
                      step="any"
                      value={location.lat}
                      onChange={(e) => {
                        const locations = [...(formData.locations || [])];
                        locations[index] = { ...location, lat: parseFloat(e.target.value) || 0 };
                        handleChange('locations', locations);
                      }}
                      placeholder="51.5074"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Longitude</Label>
                    <Input
                      type="number"
                      step="any"
                      value={location.lng}
                      onChange={(e) => {
                        const locations = [...(formData.locations || [])];
                        locations[index] = { ...location, lng: parseFloat(e.target.value) || 0 };
                        handleChange('locations', locations);
                      }}
                      placeholder="-0.1278"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Number of Properties</Label>
                    <Input
                      type="number"
                      min="0"
                      value={location.propertyCount || ''}
                      onChange={(e) => {
                        const locations = [...(formData.locations || [])];
                        locations[index] = { 
                          ...location, 
                          propertyCount: parseInt(e.target.value) || 0 
                        };
                        handleChange('locations', locations);
                      }}
                      placeholder="0"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>CTA Text (Optional)</Label>
                    <Input
                      value={location.cta?.text || ''}
                      onChange={(e) => {
                        const locations = [...(formData.locations || [])];
                        locations[index] = { 
                          ...location, 
                          cta: { ...location.cta, text: e.target.value, url: location.cta?.url || '' }
                        };
                        handleChange('locations', locations);
                      }}
                      placeholder="Button text"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>CTA URL (Optional)</Label>
                    <Input
                      value={location.cta?.url || ''}
                      onChange={(e) => {
                        const locations = [...(formData.locations || [])];
                        locations[index] = { 
                          ...location, 
                          cta: { ...location.cta, url: e.target.value, text: location.cta?.text || '' }
                        };
                        handleChange('locations', locations);
                      }}
                      placeholder="https://..."
                    />
                  </FormGroup>
                  <Button
                    onClick={() => {
                      const locations = (formData.locations || []).filter((_, i) => i !== index);
                      handleChange('locations', locations);
                    }}
                    style={{ 
                      background: 'transparent', 
                      border: '1px solid #8C0F2E', 
                      color: '#8C0F2E',
                      marginTop: '8px' 
                    }}
                  >
                    Remove Location
                  </Button>
                </CTAFields>
              ))}
              <Button onClick={() => {
                const locations = formData.locations || [];
                const newLocation = {
                  id: uuidv4(),
                  name: '',
                  address: '',
                  lat: 0,
                  lng: 0,
                  propertyCount: 0,
                  cta: { text: '', url: '' },
                };
                handleChange('locations', [...locations, newLocation]);
              }}>
                Add Location
              </Button>
            </FormGroup>
          </>
        );

      case 'cards-carousel':
        return (
          <>
            <FormGroup>
              <Label>Section Title</Label>
              <Input
                value={formData.carouselTitle || ''}
                onChange={(e) => handleChange('carouselTitle', e.target.value)}
                placeholder="Enter section title"
              />
            </FormGroup>
            <FormGroup>
              <Label>Section Subtitle</Label>
              <Input
                value={formData.carouselSubtitle || ''}
                onChange={(e) => handleChange('carouselSubtitle', e.target.value)}
                placeholder="Enter section subtitle"
              />
            </FormGroup>
            <FormGroup>
              <Label>Number of Cards (2-4)</Label>
              <Input
                type="number"
                min="2"
                max="4"
                value={formData.cardCount || (formData.cards?.length || 2)}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue === '') {
                    return; // Don't update if empty
                  }
                  const count = Math.min(4, Math.max(2, parseInt(inputValue, 10) || 2));
                  const currentCards = formData.cards || [];
                  const newCards = [...currentCards];
                  
                  // Add cards if needed
                  while (newCards.length < count) {
                    newCards.push({
                      id: uuidv4(),
                      title: '',
                      subtitle: '',
                      distance: '',
                      cta: { text: '', url: '' },
                      cta2: { text: '', url: '' },
                    });
                  }
                  
                  // Remove cards if needed
                  while (newCards.length > count) {
                    newCards.pop();
                  }
                  
                  // Update both cardCount and cards in a single update
                  updateSection(currentSection.id, {
                    ...formData,
                    cardCount: count,
                    cards: newCards,
                  });
                }}
              />
            </FormGroup>
            {(formData.cards || []).map((card, index) => (
              <CTAFields key={card.id}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 400 }}>Card {index + 1}</h3>
                <FormGroup>
                  <Label>Image</Label>
                  <ImageUploader
                    value={card.image}
                    onChange={(image) => {
                      const cards = [...(formData.cards || [])];
                      cards[index] = { ...card, image };
                      handleChange('cards', cards);
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Title</Label>
                  <Input
                    value={card.title}
                    onChange={(e) => {
                      const cards = [...(formData.cards || [])];
                      cards[index] = { ...card, title: e.target.value };
                      handleChange('cards', cards);
                    }}
                    placeholder="Card title"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Subtitle</Label>
                  <Input
                    value={card.subtitle || ''}
                    onChange={(e) => {
                      const cards = [...(formData.cards || [])];
                      cards[index] = { ...card, subtitle: e.target.value };
                      handleChange('cards', cards);
                    }}
                    placeholder="Card subtitle/address"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Distance (optional)</Label>
                  <Input
                    value={card.distance || ''}
                    onChange={(e) => {
                      const cards = [...(formData.cards || [])];
                      cards[index] = { ...card, distance: e.target.value };
                      handleChange('cards', cards);
                    }}
                    placeholder="e.g., 2.9 km"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>CTA 1 (Contact) Text</Label>
                  <Input
                    value={card.cta?.text || ''}
                    onChange={(e) => {
                      const cards = [...(formData.cards || [])];
                      cards[index] = { ...card, cta: { ...card.cta, text: e.target.value, url: card.cta?.url || '' } };
                      handleChange('cards', cards);
                    }}
                    placeholder="Contact"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>CTA 1 (Contact) URL</Label>
                  <Input
                    value={card.cta?.url || ''}
                    onChange={(e) => {
                      const cards = [...(formData.cards || [])];
                      cards[index] = { ...card, cta: { ...card.cta, text: card.cta?.text || '', url: e.target.value } };
                      handleChange('cards', cards);
                    }}
                    placeholder="mailto: or https://..."
                  />
                </FormGroup>
                <FormGroup>
                  <Label>CTA 2 (Details) Text</Label>
                  <Input
                    value={card.cta2?.text || ''}
                    onChange={(e) => {
                      const cards = [...(formData.cards || [])];
                      cards[index] = { ...card, cta2: { ...card.cta2, text: e.target.value, url: card.cta2?.url || '' } };
                      handleChange('cards', cards);
                    }}
                    placeholder="Details"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>CTA 2 (Details) URL</Label>
                  <Input
                    value={card.cta2?.url || ''}
                    onChange={(e) => {
                      const cards = [...(formData.cards || [])];
                      cards[index] = { ...card, cta2: { ...card.cta2, text: card.cta2?.text || '', url: e.target.value } };
                      handleChange('cards', cards);
                    }}
                    placeholder="https://..."
                  />
                </FormGroup>
              </CTAFields>
            ))}
          </>
        );

      case 'text-boxes':
        return (
          <>
            <FormGroup>
              <Label>Number of Text Boxes (2-3)</Label>
              <Input
                type="number"
                min="2"
                max="3"
                value={formData.textBoxesCount || (formData.textBoxes?.length || 2)}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue === '') {
                    return;
                  }
                  const count = Math.min(3, Math.max(2, parseInt(inputValue, 10) || 2));
                  const currentBoxes = formData.textBoxes || [];
                  const newBoxes = [...currentBoxes];
                  
                  while (newBoxes.length < count) {
                    newBoxes.push({
                      id: uuidv4(),
                      title: '',
                      text: '',
                      backgroundColor: 'white',
                    });
                  }
                  
                  while (newBoxes.length > count) {
                    newBoxes.pop();
                  }
                  
                  updateSection(currentSection.id, {
                    ...formData,
                    textBoxesCount: count,
                    textBoxes: newBoxes,
                  });
                }}
              />
            </FormGroup>
            {(formData.textBoxes || []).map((box, index) => (
              <CTAFields key={box.id}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 400 }}>Text Box {index + 1}</h3>
                <FormGroup>
                  <Label>Background Color</Label>
                  <select
                    value={box.backgroundColor || 'white'}
                    onChange={(e) => {
                      const boxes = [...(formData.textBoxes || [])];
                      boxes[index] = { ...box, backgroundColor: e.target.value as 'white' | 'light-grey' };
                      handleChange('textBoxes', boxes);
                    }}
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #ced5d8',
                      borderRadius: '6px',
                      fontSize: '16px',
                      color: '#01151d',
                      background: '#ffffff',
                      width: '100%',
                    }}
                  >
                    <option value="white">White</option>
                    <option value="light-grey">Light Grey</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <Label>Title</Label>
                  <Input
                    value={box.title}
                    onChange={(e) => {
                      const boxes = [...(formData.textBoxes || [])];
                      boxes[index] = { ...box, title: e.target.value };
                      handleChange('textBoxes', boxes);
                    }}
                    placeholder="Enter title"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Text</Label>
                  <WysiwygEditor
                    value={box.text}
                    onChange={(value) => {
                      const boxes = [...(formData.textBoxes || [])];
                      boxes[index] = { ...box, text: value };
                      handleChange('textBoxes', boxes);
                    }}
                  />
                </FormGroup>
              </CTAFields>
            ))}
          </>
        );

      default:
        return <div>Edit fields for {currentSection.type}</div>;
    }
  };

  return (
    <>
      <DrawerOverlay onClick={closeDrawer} />
      <Drawer onClick={(e) => e.stopPropagation()}>
        <DrawerHeader>
          <DrawerTitle>Edit Section</DrawerTitle>
          <CloseButton onClick={closeDrawer}>
            <FiX />
          </CloseButton>
        </DrawerHeader>
        <DrawerContent>
          {renderFields()}
          <Button onClick={handleDelete} style={{ 
            background: 'transparent', 
            border: '1px solid #8C0F2E', 
            color: '#8C0F2E',
            marginTop: '24px' 
          }}>
            Delete Section
          </Button>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SectionEditorDrawer;

