
export const CHUNK_SIZE = 400;
export const CHUNK_OVERLAP = 50;
export const MIN_CHUNK_LENGTH = 50;

export async function processFileContent(base64Content: string, fileType: string): Promise<string> {
  try {
    let text = '';
    
    if (fileType === 'text/plain') {
      text = atob(base64Content);
    } else if (fileType === 'application/pdf') {
      text = await processPdfContent(base64Content);
    } else {
      throw new Error('Unsupported file type');
    }

    return text;
  } catch (error) {
    console.error('Error processing file content:', error);
    throw error;
  }
}

async function processPdfContent(base64Content: string): Promise<string> {
  const decoded = atob(base64Content);
  
  // First pass: Remove binary data and control characters
  let cleanedText = decoded
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    .replace(/[\x7F-\x9F\uFFFD-\uFFFF]/g, '')
    .replace(/[^\x20-\x7E\n\r]/g, ' ');
  
  // Second pass: Clean up the text structure
  cleanedText = cleanedText
    .replace(/\\[rn]/g, '\n')
    .replace(/\r\n|\r/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .replace(/([.!?])\s*(?=[A-Z])/g, '$1\n')
    .trim();

  // Validate text structure
  const lines = cleanedText.split('\n');
  const validLines = lines.filter(line => {
    return line.trim().length > 0 && 
           line.trim().length < 1000 && 
           /[a-zA-Z0-9]/.test(line) && 
           !/^\s*[^a-zA-Z0-9\s]{2,}\s*$/.test(line);
  });

  const text = validLines.join('\n');

  // Validation checks
  if (!text || text.length < 20) {
    console.error('Extracted text is too short or empty');
    throw new Error('No valid text content could be extracted from the PDF');
  }

  const wordCount = text.split(/\s+/).length;
  const avgWordLength = text.length / wordCount;
  const hasValidWordLengths = avgWordLength >= 3 && avgWordLength <= 15;
  
  console.log('Text quality metrics:', {
    totalLength: text.length,
    wordCount,
    averageWordLength: avgWordLength,
    lineCount: validLines.length
  });

  if (!hasValidWordLengths || wordCount < 10) {
    console.error('Text quality check failed:', {
      wordCount,
      averageWordLength: avgWordLength
    });
    throw new Error('Extracted text appears to be corrupted or invalid');
  }

  return text;
}

