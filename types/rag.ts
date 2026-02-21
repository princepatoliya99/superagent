// RAG API request/response types (aligned with backend app/models/rag.py)

export interface DocumentIngestRequest {
  documents: string[];
  metadatas: Record<string, unknown>[];
  ids?: string[];
}

export interface DocumentIngestResponse {
  success: boolean;
  total_chunks: number;
  total_latency_ms: number;
}

export interface DocumentSearchRequest {
  query: string;
  n_results?: number;
  similarity_threshold?: number;
}

export interface DocumentSearchResult {
  id: string;
  chunk_text: string;
  metadata: Record<string, unknown>;
  distance: number;
}

export interface DocumentSearchResponse {
  results: DocumentSearchResult[];
  total: number;
}

export interface CollectionStatsResponse {
  collection_name: string;
  document_count: number;
  embedding_dimension: number;
  error?: string;
}

export interface RagHealthResponse {
  healthy: boolean;
  embedding_service: string;
  chromadb_service: string;
}

// PDF upload & listing

export interface PDFUploadResponse {
  filename: string;
  num_chunks: number;
  document_ids: string[];
  collection_name: string;
  status: string;
}

export interface PDFListItem {
  filename: string;
  file_hash: string;
  num_chunks: number;
  uploaded_at?: string | null;
}

export interface PDFListResponse {
  pdfs: PDFListItem[];
  total: number;
}
