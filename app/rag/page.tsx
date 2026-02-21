"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getRagStats } from "@/lib/rag-api";
import type { CollectionStatsResponse } from "@/types/rag";
import { RagHealth } from "@/components/rag/RagHealth";
import { RagStats } from "@/components/rag/RagStats";
import { RagIngest } from "@/components/rag/RagIngest";
import { RagSearch } from "@/components/rag/RagSearch";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function RagPage() {
  const [stats, setStats] = useState<CollectionStatsResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const refreshStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const data = await getRagStats();
      setStats(data);
    } catch (e) {
      setStatsError(e instanceof Error ? e.message : "Failed to load stats");
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Chat
          </Link>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/80 shadow-sm">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="text-base font-semibold text-foreground">
            Knowledge base
          </h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <RagHealth />
            <RagStats data={stats} loading={statsLoading} error={statsError} />
            <RagIngest onSuccess={refreshStats} />
          </div>
          <div className="space-y-6">
            <RagSearch onDeleteSuccess={refreshStats} />
          </div>
        </div>
      </main>
    </div>
  );
}
