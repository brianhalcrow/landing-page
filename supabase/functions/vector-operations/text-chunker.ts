import { CHUNK_SIZE, CHUNK_OVERLAP, MIN_CHUNK_LENGTH } from './text-processor.ts';

interface ChunkMetadata {
  sectionTitle?: string;
  contentType: 'paragraph' | 'list' | 'header' | 'table';
  precedingContext?: string;
  followingContext?: string;
}

export function chunkText(text: string): string[] {
  const chunks: string[] = [];
  let currentIndex = 0;

  // Pre-process text to identify structure
  const sections = identifySections(text);
  
  for (const section of sections) {
    const sectionChunks = processSection(section);
    chunks.push(...sectionChunks);
  }

  console.log(`Split content into ${chunks.length} chunks`);
  return chunks;
}

function identifySections(text: string): string[] {
  // Split text into logical sections based on headers and spacing
  return text
    .split(/(?:\r?\n){2,}/)
    .filter(section => section.trim().length > 0);
}

function processSection(section: string): string[] {
  const chunks: string[] = [];
  let currentChunk = '';
  
  // Identify content type
  const contentType = identifyContentType(section);
  
  switch (contentType) {
    case 'list':
      // Process lists while keeping items together
      const listItems = section.split(/\r?\n/);
      let currentListChunk = '';
      
      for (const item of listItems) {
        if ((currentListChunk + item).length > CHUNK_SIZE) {
          if (currentListChunk.length >= MIN_CHUNK_LENGTH) {
            chunks.push(currentListChunk.trim());
          }
          currentListChunk = item;
        } else {
          currentListChunk += (currentListChunk ? '\n' : '') + item;
        }
      }
      
      if (currentListChunk.length >= MIN_CHUNK_LENGTH) {
        chunks.push(currentListChunk.trim());
      }
      break;
      
    case 'header':
      // Headers are kept as single chunks
      if (section.length >= MIN_CHUNK_LENGTH) {
        chunks.push(section.trim());
      }
      break;
      
    case 'paragraph':
    default:
      // Process paragraphs with smart sentence boundaries
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
      break;
  }

  return chunks;
}

function identifyContentType(section: string): 'paragraph' | 'list' | 'header' | 'table' {
  // Check for list patterns
  if (section.split('\n').every(line => /^[-*•]|\d+\./.test(line.trim()))) {
    return 'list';
  }
  
  // Check for headers
  if (section.length < 100 && /^[A-Z][\w\s-]+$/.test(section.trim())) {
    return 'header';
  }
  
  // Check for table patterns (simple check for now)
  if (section.split('\n').every(line => line.includes('|'))) {
    return 'table';
  }
  
  // Default to paragraph
  return 'paragraph';
}

function calculateDynamicOverlap(chunk: string, nextChunk: string): number {
  // Adjust overlap based on content complexity and semantic boundaries
  const baseOverlap = CHUNK_OVERLAP;
  
  // Increase overlap for complex content (e.g., technical terms)
  if (/[A-Z][a-z]+(?:\s+[A-Z][a-z]+){2,}/.test(chunk)) {
    return Math.min(baseOverlap * 1.5, chunk.length / 2);
  }
  
  // Reduce overlap for simple content
  if (chunk.split(/\s+/).length < 10) {
    return Math.max(baseOverlap * 0.5, MIN_CHUNK_LENGTH);
  }
  
  return baseOverlap;
}
