
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

    let currentChunk = '';
    const sentences = section.match(/[^.!?]+[.!?]+/g) || [section];
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > CHUNK_SIZE) {
        if (currentChunk.length >= MIN_CHUNK_LENGTH) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + sentence;
      }
    }
    
    if (currentChunk.length >= MIN_CHUNK_LENGTH) {
      chunks.push(currentChunk.trim());
    }
  }

  return chunks;
}
