
export interface FileMetadata {
  fileName: string;
  fileType: string;
  size: number;
  uploadedAt: string;
  status: 'processing' | 'completed' | 'failed';
  category?: string;
  difficulty?: string;
  section?: string;
}

export interface StoreRequestBody {
  action: 'store';
  file: {
    name: string;
    type: string;
    size: number;
    content: string;
  };
  metadata: FileMetadata;
}

export interface SearchRequestBody {
  action: 'search';
  query: string;
  match_threshold?: number;
  match_count?: number;
}

export type RequestBody = StoreRequestBody | SearchRequestBody;
