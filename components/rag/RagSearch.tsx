"use client";

import { useState } from "react";
import { searchDocuments, deleteDocument } from "@/lib/rag-api";
import type { DocumentSearchResult } from "@/types/rag";
import { Search, Loader2, Trash2 } from "lucide-react";

interface RagSearchProps {
  onDeleteSuccess: () => void;
}

export function RagSearch({ onDeleteSuccess }: RagSearchProps) {
  const [query, setQuery] = useState("");
  const [nResults, setNResults] = useState(5);
  const [threshold, setThreshold] = useState(0.85);
  const [results, setResults] = useState<DocumentSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const res = await searchDocuments({
        query: q,
        n_results: nResults,
        similarity_threshold: threshold,
      });
      setResults(res.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteDocument(id);
      setResults((prev) => prev.filter((r) => r.id !== id));
      onDeleteSuccess();
    } catch {
      // keep result in list on error
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Search className="h-4 w-4" />
        Search knowledge base
      </h2>
      <form onSubmit={handleSearch} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Query
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Natural language search..."
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="rag-n-results" className="mb-1 block text-xs font-medium text-muted-foreground">
              Max results (1–50)
            </label>
            <input
              id="rag-n-results"
              type="number"
              min={1}
              max={50}
              value={nResults}
              onChange={(e) => setNResults(Number(e.target.value))}
              aria-label="Max results 1 to 50"
              className="w-20 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <div>
            <label htmlFor="rag-threshold" className="mb-1 block text-xs font-medium text-muted-foreground">
              Similarity threshold (0–2)
            </label>
            <input
              id="rag-threshold"
              type="number"
              min={0}
              max={2}
              step={0.05}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              aria-label="Similarity threshold 0 to 2"
              className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Search
        </button>
      </form>

      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-xs font-medium text-muted-foreground">Results</h3>
          <ul className="space-y-2">
            {results.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-border bg-muted/50 p-3 text-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs text-muted-foreground">{r.id}</p>
                    <p className="mt-1 whitespace-pre-wrap text-foreground">
                      {r.chunk_text}
                    </p>
                    {Object.keys(r.metadata).length > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {JSON.stringify(r.metadata)}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      distance: {r.distance.toFixed(4)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    disabled={deletingId === r.id}
                    className="shrink-0 rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                    aria-label={`Delete ${r.id}`}
                  >
                    {deletingId === r.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
