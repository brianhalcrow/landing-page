
import mammoth from 'mammoth';

export const processDocFile = async (file: File): Promise<string> => {
  try {
    // Convert the File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Extract text from the doc/docx file
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (result.value) {
      // Clean up the extracted text
      return result.value
        .replace(/\r\n/g, '\n') // Normalize line endings
        .replace(/\n{3,}/g, '\n\n') // Remove excess blank lines
        .trim();
    }
    
    if (result.messages.length > 0) {
      console.warn('Warnings while processing document:', result.messages);
    }
    
    throw new Error('No content could be extracted from the document');
  } catch (error) {
    console.error('Error processing doc file:', error);
    throw new Error('Failed to process document file: ' + (error.message || 'Unknown error'));
  }
};
