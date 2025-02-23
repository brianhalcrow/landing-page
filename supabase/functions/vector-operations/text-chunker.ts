
const MAX_CHUNK_SIZE = 1000; // Adjusted for OpenAI's token limits
const MIN_CHUNK_SIZE = 100;

export function chunkDocument(text: string): string[] {
  console.log('Starting document chunking...');
  
  // Clean and normalize text
  const cleanText = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const paragraphs = cleanText.split('\n\n');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    // If paragraph itself is too long, split by sentences
    if (paragraph.length > MAX_CHUNK_SIZE) {
      const sentences = paragraph
        .replace(/([.!?])\s+/g, '$1|')
        .split('|');

      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length > MAX_CHUNK_SIZE) {
          if (currentChunk.length > MIN_CHUNK_SIZE) {
            chunks.push(currentChunk.trim());
          }
          currentChunk = sentence;
        } else {
          currentChunk += (currentChunk ? ' ' : '') + sentence;
        }
      }
    } else {
      // Handle normal paragraphs
      if (currentChunk.length + paragraph.length > MAX_CHUNK_SIZE) {
        if (currentChunk.length > MIN_CHUNK_SIZE) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = paragraph;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      }
    }
  }

  // Add the last chunk if it's not empty
  if (currentChunk.length > MIN_CHUNK_SIZE) {
    chunks.push(currentChunk.trim());
  }

  console.log(`Document chunked into ${chunks.length} parts`);
  console.log('Average chunk size:', chunks.reduce((sum, chunk) => sum + chunk.length, 0) / chunks.length);
  
  return chunks;
}
