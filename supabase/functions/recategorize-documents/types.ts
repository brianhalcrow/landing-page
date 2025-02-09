
export interface DocumentMetadata {
  category?: string;
  section?: string;
  difficulty?: string;
  recategorized_at?: string;
  retry_count?: number;
}

export interface Document {
  id: number;
  content: string;
  metadata: DocumentMetadata;
}

export interface ProcessingResult {
  id: number;
  success: boolean;
  analysis?: {
    category: string;
    section: string;
    difficulty: string;
  };
  error?: string;
  progressMessage: string;
}
