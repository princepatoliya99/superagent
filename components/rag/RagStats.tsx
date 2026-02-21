"use client";

import type { CollectionStatsResponse } from "@/types/rag";
import { Database } from "lucide-react";

interface RagStatsProps {
  data: CollectionStatsResponse | null;
  loading: boolean;
  error: string | null;
}

export function RagStats({ data, loading, error }: RagStatsProps) {
  if (loading && !data) {
    return (
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Collection stats</h2>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Database className="h-4 w-4" />
        Collection stats
      </h2>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      {data && (
        <>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Collection</dt>
              <dd className="font-medium text-foreground">{data.collection_name}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Document count</dt>
              <dd className="font-medium text-foreground">{data.document_count}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Embedding dimension</dt>
              <dd className="font-medium text-foreground">{data.embedding_dimension}</dd>
            </div>
          </dl>
          {data.error && (
            <p className="mt-2 text-sm text-destructive">{data.error}</p>
          )}
        </>
      )}
    </section>
  );
}
