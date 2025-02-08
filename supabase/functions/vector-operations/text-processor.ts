
export const CHUNK_SIZE = 400;
export const CHUNK_OVERLAP = 50;
export const MIN_CHUNK_LENGTH = 50;

// Format financial text content with consistent spacing and structure
function formatFinancialText(text: string): string {
  return text
    // Standardize newlines
    .replace(/\r\n/g, '\n')
    // Remove multiple spaces
    .replace(/[ ]{2,}/g, ' ')
    // Fix common OCR/formatting issues with numbers and symbols
    .replace(/(\d)\s+\./g, '$1.')
    .replace(/(\d)\s+%/g, '$1%')
    .replace(/\$\s+(\d)/g, '$$$1')
    // Ensure mathematical operations have consistent spacing
    .replace(/(\d)\s*([+\-=@])\s*(\d)/g, '$1 $2 $3')
    // Ensure currency codes have proper spacing
    .replace(/(USD|GBP|EUR|CHF|JPY)\s*(\d)/g, '$1 $2')
    // Separate sections with double newlines
    .replace(/\n{3,}/g, '\n\n')
    // Ensure examples and their explanations stay together
    .replace(/Example(\s+\d+)?:/g, '\n\nExample$1:\n')
    .replace(/Analysis:/g, '\n\nAnalysis:\n')
    .replace(/Result:/g, '\n\nResult:\n')
    .trim();
}

export async function processFileContent(base64Content: string, fileType: string): Promise<string> {
  try {
    if (fileType !== 'text/plain') {
      throw new Error('Only text/plain files are currently supported');
    }

    const text = atob(base64Content);
    const formattedText = formatFinancialText(text);
    console.log('Processed text length:', formattedText.length);
    return formattedText;
    
  } catch (error) {
    console.error('Error processing file content:', error);
    throw error;
  }
}
