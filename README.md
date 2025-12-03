# JLL Content Editor

A powerful content editor for the JLL marketing team to create and export HTML pages matching the JLL Residential website design.

## Features

- **10-16 Section Layouts**: Choose from various pre-designed section templates
- **WYSIWYG Editor**: Rich text editing with formatting options
- **Image Upload**: Support for both local file uploads and cloud storage URLs
- **Live Preview**: See your changes in real-time
- **HTML Export**: Export as standalone HTML or template format
- **Draft Management**: Save and load your work for later
- **JLL Design System**: All components match the JLL Residential design

## Section Types

1. **Hero with Image & Text** - Full-width hero section with overlay text
2. **Image Left, Text Right** - Image and content side-by-side
3. **Image Right, Text Left** - Image and content side-by-side (reversed)
4. **Text with CTA** - Text section with 1-2 call-to-action buttons
5. **Cards Carousel** - Scrollable card gallery
6. **Plain Text** - Simple title and body text section
7. **Map with Locations** - Map section with location pins

## Getting Started

### Prerequisites

- **Node.js** (version 16 or higher recommended)
- **npm** (comes with Node.js)

### Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd "page editor"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Project

#### Development Mode

To start the development server:

```bash
npm run dev
```

The application will start and automatically open in your browser at `http://localhost:5173` (or the next available port). The dev server supports hot module replacement, so changes will be reflected immediately.

#### Production Build

To create a production build:

```bash
npm run build
```

This will create an optimized build in the `dist` directory.

#### Preview Production Build

To preview the production build locally:

```bash
npm run build
npm run preview
```

This will serve the production build at `http://localhost:4173` (or the next available port).

#### Linting

To check code quality and style:

```bash
npm run lint
```

## Usage

1. **Add a Section**: Click the "+ Add Section" button to open the section library
2. **Choose Layout**: Select from the available section layouts
3. **Edit Content**: Fill in the fields in the right drawer:
   - Use the WYSIWYG editor for rich text
   - Upload images or paste image URLs
   - Add CTAs with custom text and URLs
4. **Save Draft**: Click "Save Draft" to save your work locally
5. **Export HTML**: Click "Export HTML" to download a standalone HTML file, or "Export Template" for a template format

## Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Styled Components** for styling
- **React Quill** for WYSIWYG editing
- **Context API** for state management

## Project Structure

```
src/
  components/
    sections/          # Section components (Hero, ImageText, etc.)
    EditorPage.tsx     # Main editor page
    SectionLibrary.tsx # Section selection drawer
    SectionEditorDrawer.tsx # Section editing drawer
    SectionRenderer.tsx # Section renderer
    Toolbar.tsx       # Top toolbar
    WysiwygEditor.tsx # WYSIWYG editor wrapper
    ImageUploader.tsx # Image upload component
  context/
    EditorContext.tsx # State management
  types/
    index.ts          # TypeScript types
  utils/
    htmlExporter.ts   # HTML export functionality
```

## Design System

The editor follows the JLL Residential design system:
- Colors: Primary (#01151d), Accent (#de0614), Text (#56656b)
- Typography: Source Sans Pro
- Spacing: Consistent 8px grid system
- Components match the Figma designs

## Future Enhancements

- Backend integration for draft saving
- Cloud image storage integration
- Section reordering via drag-and-drop
- More section types
- Template library
- Collaboration features

