import { CHUNK_SIZE, CHUNK_OVERLAP, MIN_CHUNK_LENGTH } from './text-processor.ts';

function isCompleteSection(text: string): boolean {
  // Check if the section contains a complete example or definition
  return (
    text.includes('Example') ||
    text.includes('Definition:') ||
    text.includes('Analysis:') ||
    text.includes('Result:') ||
    // Check for complete mathematical expressions
    (text.includes('=') && text.includes('@')) ||
    // Check for currency pairs
    /[A-Z]{3}\/[A-Z]{3}/.test(text)
  );
}

export function chunkText(text: string): string[] {
  // Split on double newlines to preserve logical sections
  const sections = text
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map(section => section.trim())
    .filter(section => section.length >= MIN_CHUNK_LENGTH);

  const chunks: string[] = [];
  let currentChunk = '';

  for (const section of sections) {
    // If section fits in one chunk and is a complete concept, keep it as is
    if (section.length <= CHUNK_SIZE && isCompleteSection(section)) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      chunks.push(section);
      continue;
    }

    // If adding this section would exceed chunk size
    if ((currentChunk + '\n\n' + section).length > CHUNK_SIZE) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = section;
      } else {
        // Split section into sentences
        const sentences = section.match(/[^.!?]+[.!?]+/g) || [section];
        for (const sentence of sentences) {
          if ((currentChunk + '\n' + sentence).length > CHUNK_SIZE) {
            if (currentChunk.length >= MIN_CHUNK_LENGTH) {
              chunks.push(currentChunk.trim());
            }
            currentChunk = sentence.trim();
          } else {
            currentChunk += (currentChunk ? '\n' : '') + sentence.trim();
          }
        }
      }
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + section;
    }
  }

  // Add final chunk if it meets minimum length
  if (currentChunk && currentChunk.length >= MIN_CHUNK_LENGTH) {
    chunks.push(currentChunk.trim());
  }

  // Post-process chunks to ensure they start with complete words
  return chunks
    .map(chunk => {
      // If chunk starts with a partial word, remove it
      const firstSpaceIndex = chunk.indexOf(' ');
      if (firstSpaceIndex > 0 && !/^\w+/.test(chunk)) {
        return chunk.substring(firstSpaceIndex + 1);
      }
      return chunk;
    })
    .filter(chunk => chunk.length >= MIN_CHUNK_LENGTH);
}
