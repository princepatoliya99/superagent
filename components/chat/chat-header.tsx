"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Sparkles, MessageSquarePlus, Loader2, BookOpen } from "lucide-react";

type ConnectionStatus = "disconnected" | "connecting" | "connected";

interface ChatHeaderProps {
  onNewChat: () => void;
  connectionStatus: ConnectionStatus;
}

export function ChatHeader({ onNewChat, connectionStatus }: ChatHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/80 shadow-sm">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <h1 className="text-base font-semibold text-foreground">SuperAgent</h1>
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
            connectionStatus === "connected" &&
              "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
            connectionStatus === "connecting" &&
              "bg-amber-500/10 text-amber-700 dark:text-amber-400",
            connectionStatus === "disconnected" &&
              "bg-muted text-muted-foreground",
          )}
        >
          {connectionStatus === "connecting" && (
            <Loader2 className="h-3 w-3 animate-spin" />
          )}
          {connectionStatus === "connected" && (
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          )}
          {connectionStatus === "disconnected" && (
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
          )}
          {connectionStatus === "connected" && "Connected"}
          {connectionStatus === "connecting" && "Connecting..."}
          {connectionStatus === "disconnected" && "Disconnected"}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Link
          href="/rag"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Knowledge base"
        >
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Knowledge base</span>
        </Link>
        <button
          onClick={onNewChat}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="New chat"
        >
          <MessageSquarePlus className="h-4 w-4" />
          <span className="hidden sm:inline">New chat</span>
        </button>
      </div>
    </header>
  );
}
