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

// Helper function to check if a string ends with a sentence boundary
function endsWithSentenceBoundary(text: string): boolean {
  return /[.!?]\s*$/.test(text);
}

export function chunkText(text: string): string[] {
  console.log('[TextChunker] Starting text chunking process');
  console.log(`[TextChunker] Input text length: ${text.length} characters`);
  console.log(`[TextChunker] Configuration: CHUNK_SIZE=${CHUNK_SIZE}, OVERLAP=${CHUNK_OVERLAP}, MIN_LENGTH=${MIN_CHUNK_LENGTH}`);

  // First split by double newlines to get logical sections
  const sections = text
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map(section => section.trim())
    .filter(section => section.length >= MIN_CHUNK_LENGTH);

  console.log(`[TextChunker] Initial sections count: ${sections.length}`);
  console.log('[TextChunker] First section preview:', sections[0]?.slice(0, 100));

  const chunks: string[] = [];
  let currentChunk = '';
  let overlapText = '';

  for (const section of sections) {
    // If the section is a complete, self-contained unit and fits in a chunk, keep it whole
    if (section.length <= CHUNK_SIZE && isCompleteSection(section)) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      chunks.push(section);
      continue;
    }

    // Split section into sentences
    const sentences = section.match(/[^.!?]+[.!?]+/g) || [section];
    
    for (let sentence of sentences) {
      sentence = sentence.trim();
      
      // Skip empty sentences
      if (!sentence) continue;

      // If adding this sentence would exceed chunk size
      if ((currentChunk + ' ' + sentence).length > CHUNK_SIZE) {
        if (currentChunk) {
          // Store the current chunk if it's not empty
          chunks.push(currentChunk.trim());
          
          // Keep the last sentence for overlap if it's a complete sentence
          if (endsWithSentenceBoundary(currentChunk)) {
            overlapText = currentChunk.split(/[.!?]\s*/).slice(-1)[0].trim();
          }
          
          // Start new chunk with overlap text if available
          currentChunk = overlapText ? overlapText + ' ' + sentence : sentence;
          overlapText = '';
        } else {
          // If the sentence itself is too long, split it at word boundaries
          currentChunk = sentence;
        }
      } else {
        // Add sentence to current chunk
        currentChunk = currentChunk ? currentChunk + ' ' + sentence : sentence;
      }
    }
  }

  // Add the last chunk if there is one
  if (currentChunk && currentChunk.length >= MIN_CHUNK_LENGTH) {
    chunks.push(currentChunk.trim());
  }

  const finalChunks = chunks
    .map(chunk => chunk.trim())
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
