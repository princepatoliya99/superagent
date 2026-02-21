"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Search,
  Wrench,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Link as LinkIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { ToolActivity } from "@/types/chat";

interface ToolActivityCardProps {
  activity: ToolActivity;
  onAuthCompleted?: () => void;
}

export function ToolActivityCard({
  activity,
  onAuthCompleted,
}: ToolActivityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [authWindowOpened, setAuthWindowOpened] = useState(false);

  const getIcon = () => {
    switch (activity.type) {
      case "rag_context":
        return <BookOpen className="h-3.5 w-3.5" />;
      case "tool_search":
        return <Search className="h-3.5 w-3.5" />;
      case "tool_call":
        return <Wrench className="h-3.5 w-3.5" />;
      case "tool_result":
        return <CheckCircle className="h-3.5 w-3.5" />;
      case "connection_status":
        return activity.data.connected ? (
          <CheckCircle2 className="h-3.5 w-3.5" />
        ) : (
          <AlertCircle className="h-3.5 w-3.5" />
        );
      case "connection_required":
        return <LinkIcon className="h-3.5 w-3.5" />;
      case "connection_waiting":
        return <Loader2 className="h-3.5 w-3.5 animate-spin" />;
      case "connection_established":
        return <CheckCircle2 className="h-3.5 w-3.5" />;
    }
  };

  const getLabel = () => {
    switch (activity.type) {
      case "rag_context": {
        const n = activity.data.results_count ?? 0;
        return `RAG: ${n} result${n === 1 ? "" : "s"} used from knowledge base`;
      }
      case "tool_search":
        const toolkits =
          activity.data.toolkits && Array.isArray(activity.data.toolkits)
            ? ` (${activity.data.toolkits.join(", ")})`
            : "";
        return `Searching tools: "${activity.data.query}" — found ${activity.data.tools_found}${toolkits}`;
      case "tool_call":
        return `Calling: ${activity.data.name}`;
      case "tool_result":
        return `Result from: ${activity.data.name}`;
      case "connection_status":
        return `${activity.data.toolkit}: ${activity.data.connected ? "Connected" : "Not connected"}`;
      case "connection_required":
        return `${activity.data.toolkit}: Authentication required`;
      case "connection_waiting":
        return activity.data.message as string;
      case "connection_established":
        return activity.data.message as string;
    }
  };

  const getDetails = () => {
    switch (activity.type) {
      case "tool_call":
        return JSON.stringify(activity.data.arguments, null, 2);
      case "tool_result":
        return JSON.stringify(activity.data.result, null, 2);
      default:
        return null;
    }
  };

  const getBackgroundClass = () => {
    switch (activity.type) {
      case "rag_context":
        return "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50";
      case "connection_required":
        return "border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/30";
      case "connection_waiting":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30";
      case "connection_established":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30";
      case "connection_status":
        return activity.data.connected
          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
          : "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30";
      default:
        return "border-tool-border bg-tool-bg hover:bg-amber-50/80 dark:border-amber-800/50 dark:bg-amber-950/20";
    }
  };

  const details = getDetails();
  const isConnectionRequired = activity.type === "connection_required";
  const authUrl = isConnectionRequired
    ? (activity.data.redirect_url as string)
    : null;

  // Render special auth button for connection_required
  if (isConnectionRequired && authUrl) {
    return (
      <div className="mx-auto my-4 max-w-3xl px-4">
        <div className="flex flex-col gap-4 rounded-2xl border-2 border-border bg-card p-5 shadow-lg transition-shadow hover:shadow-xl dark:bg-card/95">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
              <LinkIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-foreground">
                {activity.data.toolkit}: Authentication Required
              </p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {activity.data.message || "Please authorize to continue"}
              </p>
            </div>
            {!authWindowOpened && (
              <button
                onClick={() => {
                  window.open(authUrl, "_blank", "width=600,height=800");
                  setAuthWindowOpened(true);
                }}
                className="shrink-0 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95"
              >
                Authorize
              </button>
            )}
          </div>
          {authWindowOpened && (
            <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-green-800 dark:bg-green-950/30">
              <p className="text-sm text-muted-foreground">
                Completed authentication in the popup?
              </p>
              <button
                onClick={() => {
                  onAuthCompleted?.();
                }}
                className="shrink-0 rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 active:scale-95"
              >
                I&apos;ve completed authentication
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-11 my-1">
      <button
        onClick={() => {
          if (details) {
            setIsExpanded(!isExpanded);
          }
        }}
        className={cn(
          "flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs transition-colors",
          getBackgroundClass(),
          "text-muted-foreground",
          details && "cursor-pointer",
        )}
      >
        <span
          className={cn(
            "shrink-0",
            activity.type === "connection_waiting" && "text-yellow-600",
            activity.type === "connection_established" && "text-green-600",
            activity.type === "connection_status" &&
              (activity.data.connected ? "text-green-600" : "text-orange-600"),
            activity.type === "rag_context" &&
              "text-slate-600 dark:text-slate-400",
            !activity.type.startsWith("connection") &&
              activity.type !== "rag_context" &&
              "text-amber-600 dark:text-amber-400",
          )}
        >
          {getIcon()}
        </span>
        <span className="flex-1 truncate">{getLabel()}</span>
        {details && (
          <span className="shrink-0 text-muted-foreground">
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </span>
        )}
      </button>

      {isExpanded && details && (
        <div className="mt-1 overflow-x-auto rounded-lg border border-border bg-muted px-3 py-2">
          <pre className="text-xs text-muted-foreground">{details}</pre>
        </div>
      )}
    </div>
  );
}
