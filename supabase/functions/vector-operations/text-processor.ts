
export const CHUNK_SIZE = 400;
export const CHUNK_OVERLAP = 50;
export const MIN_CHUNK_LENGTH = 50;

export async function processFileContent(base64Content: string, fileType: string): Promise<string> {
  try {
    if (fileType !== 'text/plain') {
      throw new Error('Only text/plain files are currently supported');
    }

    const text = atob(base64Content);
    return text;
    
  } catch (error) {
    console.error('Error processing file content:', error);
    throw error;
  }
}
