"use client";

import { useState } from "react";
import { ingestDocuments } from "@/lib/rag-api";
import { Upload, Plus, Loader2 } from "lucide-react";

interface RagIngestProps {
  onSuccess: () => void;
}

export function RagIngest({ onSuccess }: RagIngestProps) {
  const [chunks, setChunks] = useState<string[]>([""]);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const addChunk = () => setChunks((prev) => [...prev, ""]);

  const removeChunk = (index: number) => {
    if (chunks.length <= 1) return;
    setChunks((prev) => prev.filter((_, i) => i !== index));
  };

  const updateChunk = (index: number, value: string) => {
    setChunks((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const documents = chunks.map((c) => c.trim()).filter(Boolean);
    if (documents.length === 0) {
      setMessage({ type: "error", text: "Add at least one non-empty chunk." });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const metadatas = documents.map(() => (source ? { source } : {}));
      const res = await ingestDocuments({ documents, metadatas });
      setMessage({
        type: "success",
        text: `Ingested ${res.total_chunks} chunk(s) in ${res.total_latency_ms.toFixed(0)} ms.`,
      });
      setChunks([""]);
      setSource("");
      onSuccess();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Ingest failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Upload className="h-4 w-4" />
        Ingest documents
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Optional source (applied to all chunks)
          </label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g. manual.pdf"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground">Text chunks</label>
            <button
              type="button"
              onClick={addChunk}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Plus className="h-3 w-3" /> Add chunk
            </button>
          </div>
          <div className="space-y-2">
            {chunks.map((chunk, i) => (
              <div key={i} className="flex gap-2">
                <textarea
                  value={chunk}
                  onChange={(e) => updateChunk(i, e.target.value)}
                  placeholder={`Chunk ${i + 1}`}
                  rows={2}
                  className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
                <button
                  type="button"
                  onClick={() => removeChunk(i)}
                  disabled={chunks.length <= 1}
                  className="shrink-0 rounded-lg px-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        {message && (
          <p
            className={
              message.type === "success"
                ? "text-sm text-emerald-600"
                : "text-sm text-destructive"
            }
          >
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Ingest
        </button>
      </form>
    </section>
  );
}
