"use client";

import { useCallback, useEffect, useState } from "react";
import { listPdfs } from "@/lib/rag-api";
import type { PDFListItem } from "@/types/rag";
import { FileText, Loader2, Inbox } from "lucide-react";

export function PdfList() {
  const [pdfs, setPdfs] = useState<PDFListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPdfs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPdfs();
      setPdfs(data.pdfs);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load PDFs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPdfs();
  }, [fetchPdfs]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">Loading documents…</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={fetchPdfs}
          className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (pdfs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Inbox className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          No documents yet
        </h3>
        <p className="mt-1 max-w-xs text-center text-sm text-muted-foreground">
          Use the <span className="font-medium text-foreground">+</span> button
          in the chat input to upload PDFs to the knowledge base.
        </p>
      </div>
    );
  }

  // PDF list
  return (
    <div className="space-y-2">
      {pdfs.map((pdf) => (
        <div
          key={pdf.file_hash}
          className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3.5 transition-colors hover:bg-muted/40"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <FileText className="h-5 w-5 text-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {pdf.filename}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {pdf.num_chunks} chunk{pdf.num_chunks !== 1 ? "s" : ""}
              {pdf.uploaded_at && (
                <>
                  {" · "}
                  {new Date(pdf.uploaded_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
