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
  console.log('[TextChunker] Starting text chunking process');
  console.log(`[TextChunker] Input text length: ${text.length} characters`);
  console.log(`[TextChunker] Configuration: CHUNK_SIZE=${CHUNK_SIZE}, OVERLAP=${CHUNK_OVERLAP}, MIN_LENGTH=${MIN_CHUNK_LENGTH}`);

  const sections = text
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map(section => section.trim())
    .filter(section => section.length >= MIN_CHUNK_LENGTH);

  console.log(`[TextChunker] Initial sections count: ${sections.length}`);
  console.log('[TextChunker] First section preview:', sections[0]?.slice(0, 100));

  const chunks: string[] = [];
  let currentChunk = '';

  for (const section of sections) {
    if (section.length <= CHUNK_SIZE && isCompleteSection(section)) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      chunks.push(section);
      continue;
    }

    if ((currentChunk + '\n\n' + section).length > CHUNK_SIZE) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = section;
      } else {
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

  if (currentChunk && currentChunk.length >= MIN_CHUNK_LENGTH) {
    chunks.push(currentChunk.trim());
  }

  const finalChunks = chunks
    .map(chunk => {
      const firstSpaceIndex = chunk.indexOf(' ');
      if (firstSpaceIndex > 0 && !/^\w+/.test(chunk)) {
        return chunk.substring(firstSpaceIndex + 1);
      }
      return chunk;
    })
    .filter(chunk => chunk.length >= MIN_CHUNK_LENGTH);

  console.log(`[TextChunker] Chunking completed:
    - Total chunks: ${finalChunks.length}
    - Average chunk size: ${Math.round(finalChunks.reduce((acc, chunk) => acc + chunk.length, 0) / finalChunks.length)} characters
  `);

  finalChunks.forEach((chunk, index) => {
    console.log(`[TextChunker] Chunk ${index + 1} preview (${chunk.length} chars):`, chunk.slice(0, 100));
  });

  return finalChunks;
}
