
import { CHUNK_SIZE, CHUNK_OVERLAP, MIN_CHUNK_LENGTH } from './text-processor.ts';

export function chunkText(text: string): string[] {
  const chunks: string[] = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    // Find the end of the current chunk
    let endIndex = Math.min(currentIndex + CHUNK_SIZE, text.length);
    
    // Try to find a natural break point
    const naturalBreakIndex = text.substring(currentIndex, endIndex + 20)
      .search(/[.!?]\s/);
    
    if (naturalBreakIndex > 0 && (currentIndex + naturalBreakIndex) < text.length) {
      endIndex = currentIndex + naturalBreakIndex + 1;
    }

    // Get the chunk with overlap
    const startIndex = currentIndex === 0 ? 0 : currentIndex - CHUNK_OVERLAP;
    const chunk = text.slice(startIndex, endIndex).trim();
    
    // Only add chunks that have meaningful content
    if (chunk.length >= MIN_CHUNK_LENGTH) {
      chunks.push(chunk);
    }
    
    currentIndex = endIndex;
  }

  console.log(`Split content into ${chunks.length} chunks`);
  return chunks;
}
