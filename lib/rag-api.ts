import { API_BASE_URL } from "@/lib/constants";
import type {
  DocumentIngestRequest,
  DocumentIngestResponse,
  DocumentSearchRequest,
  DocumentSearchResponse,
  CollectionStatsResponse,
  RagHealthResponse,
  PDFUploadResponse,
  PDFListResponse,
} from "@/types/rag";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? body.message ?? JSON.stringify(body);
    } catch {
      // ignore
    }
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

export async function getRagHealth(): Promise<RagHealthResponse> {
  const res = await fetch(`${API_BASE_URL}/rag/health`);
  return handleResponse<RagHealthResponse>(res);
}

export async function getRagStats(): Promise<CollectionStatsResponse> {
  const res = await fetch(`${API_BASE_URL}/rag/stats`);
  return handleResponse<CollectionStatsResponse>(res);
}

export async function ingestDocuments(
  body: DocumentIngestRequest,
): Promise<DocumentIngestResponse> {
  const res = await fetch(`${API_BASE_URL}/rag/documents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse<DocumentIngestResponse>(res);
}

export async function searchDocuments(
  body: DocumentSearchRequest,
): Promise<DocumentSearchResponse> {
  const res = await fetch(`${API_BASE_URL}/rag/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse<DocumentSearchResponse>(res);
}

export async function deleteDocument(
  id: string,
): Promise<{ deleted: boolean; id: string }> {
  const res = await fetch(
    `${API_BASE_URL}/rag/documents/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );
  return handleResponse<{ deleted: boolean; id: string }>(res);
}

// ── PDF Upload & List ──

export async function uploadPdf(file: File): Promise<PDFUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/rag/upload-pdf`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<PDFUploadResponse>(res);
}

export async function listPdfs(): Promise<PDFListResponse> {
  const res = await fetch(`${API_BASE_URL}/rag/pdfs`);
  return handleResponse<PDFListResponse>(res);
}
