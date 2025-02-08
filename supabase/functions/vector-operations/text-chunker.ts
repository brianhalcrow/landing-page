import { CHUNK_SIZE, CHUNK_OVERLAP, MIN_CHUNK_LENGTH } from './text-processor.ts';

export function chunkText(text: string): string[] {
  // Pre-process text to identify structure - split on double newlines
  const sections = text
    .split(/\r?\n\s*\r?\n/)
    .filter(Boolean)
    .map(section => section.trim())
    .filter(section => section.length >= MIN_CHUNK_LENGTH);

  const chunks: string[] = [];
  
  for (const section of sections) {
    // If section fits in one chunk, keep it as is
    if (section.length <= CHUNK_SIZE) {
      chunks.push(section);
      continue;
    }

    // Split into sentences, preserving sentence boundaries
    const sentences = section.match(/[^.!?]+[.!?]+/g) || [section];
    let currentChunk = '';

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      
      // If adding this sentence would exceed chunk size
      if ((currentChunk + ' ' + sentence).length > CHUNK_SIZE) {
        // Store current chunk if it meets minimum length
        if (currentChunk.length >= MIN_CHUNK_LENGTH) {
          chunks.push(currentChunk.trim());
        }
        
        // Start new chunk with current sentence
        currentChunk = sentence;
      } else {
        // Add sentence to current chunk
        currentChunk += (currentChunk ? ' ' : '') + sentence;
      }

      // Handle last chunk
      if (i === sentences.length - 1 && currentChunk.length >= MIN_CHUNK_LENGTH) {
        chunks.push(currentChunk.trim());
      }
    }
  }

  // Post-process: Ensure each chunk starts with a complete word
  return chunks.map(chunk => {
    // If chunk starts with a partial word, remove it
    const firstSpaceIndex = chunk.indexOf(' ');
    if (firstSpaceIndex > 0 && !/^\w+/.test(chunk)) {
      return chunk.substring(firstSpaceIndex + 1);
    }
    return chunk;
  }).filter(chunk => chunk.length >= MIN_CHUNK_LENGTH);
}
