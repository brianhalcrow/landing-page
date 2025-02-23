
export interface DocumentFile {
  name: string;
  type: string;
  size: number;
  content: string;
}

export interface DocumentMetadata {
  fileName: string;
  fileType: string;
  size: number;
  uploadedAt: string;
  status: 'processing' | 'completed' | 'error';
  category: string;
  section: string;
  difficulty: string;
}

export interface StoreResult {
  success: boolean;
  chunks_processed: number;
  total_chunks: number;
  first_chunk_id: number;
}

export interface SearchResult {
  id: number;
  content: string;
  metadata: DocumentMetadata;
  similarity: number;
}
