"use client";

import { useEffect, useState } from "react";
import { getRagHealth } from "@/lib/rag-api";
import type { RagHealthResponse } from "@/types/rag";
import { RefreshCw, CheckCircle, XCircle, Loader2 } from "lucide-react";

export function RagHealth() {
  const [data, setData] = useState<RagHealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRagHealth();
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch health");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  if (loading && !data) {
    return (
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-foreground">RAG pipeline health</h2>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Checking...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">RAG pipeline health</h2>
        <button
          type="button"
          onClick={fetchHealth}
          disabled={loading}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
        >
          <RefreshCw className={loading ? "h-3 w-3 animate-spin" : "h-3 w-3"} />
          Refresh
        </button>
      </div>
      {error && (
        <p className="mb-2 text-sm text-destructive">RAG unavailable: {error}</p>
      )}
      {data && (
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            {data.healthy ? (
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            ) : (
              <XCircle className="h-4 w-4 text-destructive" />
            )}
            <span className={data.healthy ? "text-foreground" : "text-destructive"}>
              {data.healthy ? "Healthy" : "Unhealthy"}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 text-muted-foreground">
            <span>Embedding: {data.embedding_service}</span>
            <span>ChromaDB: {data.chromadb_service}</span>
          </div>
        </div>
      )}
    </section>
  );
}
