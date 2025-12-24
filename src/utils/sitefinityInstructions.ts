import { Section, SectionType } from '../types';

export interface SitefinityInstructions {
  formattedText: string;
  codeBlock: string;
}

/**
 * Escapes HTML for use in Sitefinity body fields
 */
function escapeHtmlForSitefinity(html: string): string {
  // Sitefinity body fields can contain HTML, but we need to ensure proper formatting
  // Replace line breaks with <br> tags if needed
  return html
    .replace(/\n/g, '<br>')
    .replace(/\r\n/g, '<br>');
}

/**
 * Formats text content for Sitefinity body field
 */
function formatBodyText(text: string): string {
  // Convert plain text to HTML paragraphs if needed
  if (!text.includes('<')) {
    // Plain text - wrap in paragraph tags
    return `<p>${escapeHtmlForSitefinity(text)}</p>`;
  }
  // Already HTML - just escape properly
  return escapeHtmlForSitefinity(text);
}

/**
 * Converts list items from HTML to Sitefinity format
 */
function formatListItems(text: string): string {
  // If text contains list items, format them properly
  if (text.includes('<li>') || text.includes('<ul>')) {
    return text; // Already formatted
  }
  return text;
}

/**
 * Generates image upload instructions
 */
function getImageInstructions(imageUrl: string | undefined, imageAlt: string | undefined): string {
  if (!imageUrl) {
    return '⚠️ **Image Required**: Add an image to this section first, then upload it to Cloudinary before proceeding.';
  }
  
  const isCloudinary = imageUrl.includes('cloudinary.com');
  
  if (isCloudinary) {
    return `✅ **Image URL**: ${imageUrl}\n\n*Note: This image is already on Cloudinary. Use this URL directly in Sitefinity.*`;
  } else {
    return `📤 **Image Upload Required**:\n\n1. Upload the image to Cloudinary first:\n   - Current image URL: ${imageUrl}\n   - Upload to your Cloudinary account\n   - Copy the Cloudinary URL\n\n2. Use the Cloudinary URL in the Sitefinity code block below.`;
  }
}

/**
 * Generates button configuration for Sitefinity
 */
function generateButtonConfig(cta: { text: string; url: string } | undefined, buttonType: 'enquiry' | 'link' = 'link'): string {
  if (!cta || !cta.text) {
    return '';
  }

  // Determine if it's an enquiry button (form button) based on URL
  // If URL is '#' or empty, it's likely a form button
  const isEnquiry = buttonType === 'enquiry' || cta.url === '#' || !cta.url;

  if (isEnquiry) {
    // Form button - use template structure (all on one line like the example)
    // Note: Form button configuration is TBD, so we'll provide a template
    return `[items.button] type = "enquiry" label = "${cta.text}" link = "${cta.url || '#'}" [items.button.formData] to = "[EMAIL_ADDRESS]" [items.button.formData.enquiryData] service = "[SERVICE_TYPE]" [items.button.formData.context] block = "[BLOCK_IDENTIFIER]" [items.button.formConfig] label = "Please fill out the form below" Title = "[FORM_TITLE]" removeFields = ["service"]`;
  } else {
    // Regular link button
    return `[items.button] type = "link" label = "${cta.text}" link = "${cta.url || '#'}"`;
  }
}

/**
 * Generates Sitefinity instructions for Image Text Left/Right sections
 */
function generateImageTextInstructions(section: Section, index: number): SitefinityInstructions {
  const data = section.data;
  const isLeft = section.type === 'image-text-left';
  const position = isLeft ? 'left' : 'right';
  
  const imageInstructions = getImageInstructions(data.image?.url, data.image?.alt);
  const imageUrl = data.image?.url || '[CLOUDINARY_IMAGE_URL]';
  const heading = data.title || '[HEADING]';
  const body = data.text ? formatListItems(formatBodyText(data.text)) : '[BODY_TEXT]';
  
  // Determine button type: if URL is '#' or empty, it's likely a form button
  const buttonType = data.cta && (data.cta.url === '#' || !data.cta.url) ? 'enquiry' : 'link';
  const buttonConfig = data.cta ? generateButtonConfig(data.cta, buttonType) : '';
  
  const formattedText = `## Section ${index + 1}: Image ${position === 'left' ? 'Left' : 'Right'} Text ${position === 'left' ? 'Right' : 'Left'}

${imageInstructions}

**Implementation Steps:**

1. **Upload Image to Cloudinary** (if not already uploaded)
   ${data.image?.url && !data.image.url.includes('cloudinary.com') ? `   - Current image: ${data.image.url}\n   - Upload this image to Cloudinary\n   - Copy the Cloudinary URL` : '   - Image is already on Cloudinary or needs to be added'}

2. **Create Content Block in Sitefinity**
   - Navigate to Content > Content Blocks in Sitefinity
   - Create a new content block
   - Select the appropriate content block type (Image Left Text Right or Image Right Text Left)

3. **Configure Content Block**
   - Copy the Sitefinity code below
   - Paste it into the content block configuration
   - Replace placeholders with actual values:
     - \`[CLOUDINARY_IMAGE_URL]\` → Your Cloudinary image URL
     - \`[HEADING]\` → Section heading
     - \`[BODY_TEXT]\` → Body content
     - For buttons: Configure form settings if using enquiry type

4. **Button Configuration** ${data.cta ? `(Button: "${data.cta.text}")` : '(No button configured)'}
   ${data.cta ? `   - Button type: ${buttonType === 'enquiry' ? 'Form button (enquiry) - Configuration TBD' : 'Link button'}\n   - ${buttonType === 'enquiry' ? 'Update form settings (email, service, context, etc.) in Sitefinity' : 'Button URL is configured'}` : '   - No button in this section'}

5. **Publish the Content Block**
   - Save and publish the content block
   - Add it to your content page`;

  const codeBlock = `[[items]]
heading = "${heading}"
body = "${body}"
[items.image] url="${imageUrl}"
${buttonConfig ? buttonConfig + '\n' : ''}[[items]]`;

  return { formattedText, codeBlock };
}

/**
 * Generates placeholder instructions for sections without mappings yet
 */
function generatePlaceholderInstructions(section: Section, index: number): SitefinityInstructions {
  const sectionTypeName = section.type
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const formattedText = `## Section ${index + 1}: ${sectionTypeName}

⚠️ **Sitefinity mapping for this section type is pending.**

**Section Type**: \`${section.type}\`

**Available Data:**
${JSON.stringify(section.data, null, 2).split('\n').map(line => `   ${line}`).join('\n')}

**Next Steps:**
1. Wait for Sitefinity mapping instructions for this section type
2. Or manually configure this section in Sitefinity based on the data above`;

  const codeBlock = `# Sitefinity mapping for "${section.type}" is pending.
# Please configure this section manually in Sitefinity.
# Section data:
${JSON.stringify(section.data, null, 2)}`;

  return { formattedText, codeBlock };
}

/**
 * Generates instructions for a single section
 */
function generateSectionInstructions(section: Section, index: number): SitefinityInstructions {
  switch (section.type) {
    case 'image-text-left':
    case 'image-text-right':
      return generateImageTextInstructions(section, index);
    
    // Placeholder for other section types - will be implemented when mappings are provided
    case 'hero-image-text':
    case 'hero-image-title-ctas':
    case 'text-cta':
    case 'cards-carousel':
    case 'plain-text':
    case 'map-locations':
    case 'text-boxes':
      return generatePlaceholderInstructions(section, index);
    
    default:
      return generatePlaceholderInstructions(section, index);
  }
}

/**
 * Main function to generate Sitefinity instructions from all sections
 */
export function generateSitefinityInstructions(sections: Section[]): string {
  if (sections.length === 0) {
    return `# Sitefinity Implementation Instructions

No sections found in the current page. Add sections to the page first, then generate instructions.`;
  }

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  
  let instructions = `# Sitefinity Implementation Instructions

This document provides step-by-step instructions for implementing your ResiStudio content page in Sitefinity CMS.

**Total Sections**: ${sortedSections.length}

---

`;

  sortedSections.forEach((section, index) => {
    const sectionInstructions = generateSectionInstructions(section, index);
    
    instructions += sectionInstructions.formattedText;
    instructions += '\n\n';
    instructions += '**Sitefinity Code Block:**\n\n';
    instructions += '```\n';
    instructions += sectionInstructions.codeBlock;
    instructions += '\n```\n\n';
    instructions += '---\n\n';
  });

  instructions += `## General Notes

- **Images**: All images must be uploaded to Cloudinary before being added to Sitefinity
- **Form Buttons**: Button configurations that navigate to forms are currently TBD (To Be Determined)
- **Testing**: Test each content block in Sitefinity before publishing to production
- **Order**: Sections should be added to the content page in the order shown above

## Need Help?

If you encounter issues or need clarification on any section, refer to the Sitefinity documentation or contact your CMS administrator.`;

  return instructions;
}

