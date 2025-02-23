
import mammoth from 'mammoth';

export const processDocFile = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
  try {
    // Validate file type more strictly
    if (!file.type.includes('msword') && !file.type.includes('openxmlformats-officedocument')) {
      throw new Error('Invalid document format. Please upload a valid .doc or .docx file.');
    }

    onProgress?.(10);
    console.log('Converting file to ArrayBuffer...');
    const arrayBuffer = await file.arrayBuffer();
    
    onProgress?.(30);
    console.log('Extracting text from document...');
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    onProgress?.(60);
    
    if (!result.value || result.value.trim().length === 0) {
      console.error('No content extracted from document');
      throw new Error('The document appears to be empty or corrupt');
    }

    if (result.messages.length > 0) {
      console.warn('Warnings while processing document:', result.messages);
    }

    onProgress?.(80);
    console.log('Cleaning extracted text...');
    
    // Enhanced text cleaning
    const cleanedText = result.value
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\n{3,}/g, '\n\n') // Remove excess blank lines
      .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable characters
      .trim();

    if (cleanedText.length < 10) { // Arbitrary minimum length
      throw new Error('Extracted content is too short or empty');
    }

    onProgress?.(100);
    console.log('Document processing completed successfully');
    
    return cleanedText;
  } catch (error) {
    console.error('Error processing doc file:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to process document: ${errorMessage}`);
  }
};
