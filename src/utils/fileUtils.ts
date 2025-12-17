import { EditorState } from '../types';

/**
 * Saves HTML content to a file using the File System Access API (with fallback)
 */
export async function saveFileLocally(content: string, filename: string = 'jll-content-draft.html'): Promise<void> {
  try {
    // Try to use File System Access API (supported in Chrome/Edge)
    if ('showSaveFilePicker' in window) {
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'HTML files',
          accept: { 'text/html': ['.html'] },
        }],
      });

      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
      return;
    }
  } catch (error: any) {
    // User cancelled the dialog or error occurred
    if (error.name !== 'AbortError') {
      console.error('File System Access API error:', error);
    } else {
      // User cancelled, don't fallback
      return;
    }
  }

  // Fallback: Download file
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Reads a file and returns its content as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsText(file);
  });
}

/**
 * Parses HTML content to extract editor state
 * This is a basic implementation - you may need to enhance it based on your HTML structure
 */
export function parseHTMLToState(htmlContent: string): EditorState | null {
  try {
    // Try to find JSON data embedded in the HTML
    // Look for a script tag with type="application/json" containing the state
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Check for embedded state in script tag
    const stateScript = doc.querySelector('script[type="application/json"][data-editor-state]');
    if (stateScript && stateScript.textContent) {
      try {
        const state = JSON.parse(stateScript.textContent);
        // Validate that it has the structure of EditorState
        if (state && typeof state === 'object' && Array.isArray(state.sections)) {
          return state as EditorState;
        }
      } catch (error) {
        console.error('Failed to parse embedded state:', error);
      }
    }

    // If no embedded state, try to parse from localStorage backup
    // This would require the HTML to have been saved with state data
    // For now, return null to indicate we couldn't parse it
    return null;
  } catch (error) {
    console.error('Failed to parse HTML:', error);
    return null;
  }
}

/**
 * Sends email with attachments (mock implementation - replace with actual email service)
 */
export async function sendEmailWithAttachments(
  email: string,
  files: File[],
  subject: string = 'JLL Content Page'
): Promise<void> {
  // This is a mock implementation
  // In a real application, you would:
  // 1. Use an email service API (SendGrid, Mailgun, etc.)
  // 2. Or use mailto: link (limited functionality)
  // 3. Or send to your backend which handles email sending

  console.log('Sending email to:', email);
  console.log('Files:', files.map(f => f.name));
  console.log('Subject:', subject);

  // Show a message to the user
  const fileNames = files.map(f => f.name).join(', ');
  alert(`Email functionality is not fully implemented. In a production environment, this would send the files to ${email}.\n\nFiles: ${fileNames}\n\nTODO: Implement actual email sending service integration (SendGrid, Mailgun, etc.)`);
  
  // TODO: Implement actual email sending service integration
  // Example: Use SendGrid, Mailgun, or your backend API to send emails with attachments
}

