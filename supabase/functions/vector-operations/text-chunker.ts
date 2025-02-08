
import { CHUNK_SIZE, CHUNK_OVERLAP, MIN_CHUNK_LENGTH } from './text-processor.ts';

export function chunkText(text: string): string[] {
  // Pre-process text to identify structure - optimize splitting
  const sections = text
    .split(/\r?\n\s*\r?\n/)
    .filter(Boolean)
    .map(section => section.trim())
    .filter(section => section.length >= MIN_CHUNK_LENGTH);

  const chunks: string[] = [];
  
  for (const section of sections) {
    // Simple paragraph splitting for efficiency
    if (section.length <= CHUNK_SIZE) {
      chunks.push(section);
      continue;
    }

    // Split into sentences, ensuring we capture the full sentence
    const sentences = section.match(/[^.!?]+[.!?]+/g) || [section];
    let currentChunk = '';
    let nextChunk = '';

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      
      // Check if adding this sentence would exceed chunk size
      if ((currentChunk + ' ' + sentence).length > CHUNK_SIZE) {
        // Store current chunk if it meets minimum length
        if (currentChunk.length >= MIN_CHUNK_LENGTH) {
          chunks.push(currentChunk.trim());
        }
        
        // Start new chunk with current sentence
        currentChunk = sentence;
        
        // Add overlap from previous chunk if exists and within size limit
        if (nextChunk && (sentence + ' ' + nextChunk).length <= CHUNK_SIZE) {
          currentChunk = nextChunk + ' ' + sentence;
          nextChunk = '';
        }
      } else {
        // Add sentence to current chunk
        currentChunk += (currentChunk ? ' ' : '') + sentence;
      }
      
      // Prepare next chunk overlap
      if (i < sentences.length - 1) {
        const nextSentence = sentences[i + 1].trim();
        if ((sentence + ' ' + nextSentence).length <= CHUNK_OVERLAP) {
          nextChunk = sentence + ' ' + nextSentence;
        } else {
          nextChunk = sentence;
        }
      }
    }
    
    // Add final chunk if it meets minimum length
    if (currentChunk.length >= MIN_CHUNK_LENGTH) {
      chunks.push(currentChunk.trim());
    }
  }

  return chunks;
}
