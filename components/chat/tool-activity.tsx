"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
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
}

export function ToolActivityCard({ activity }: ToolActivityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = () => {
    switch (activity.type) {
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
      case "connection_required":
        return "border-blue-200 bg-blue-50 hover:bg-blue-100";
      case "connection_waiting":
        return "border-yellow-200 bg-yellow-50";
      case "connection_established":
        return "border-green-200 bg-green-50";
      case "connection_status":
        return activity.data.connected
          ? "border-green-200 bg-green-50"
          : "border-orange-200 bg-orange-50";
      default:
        return "border-tool-border bg-tool-bg hover:bg-yellow-50";
    }
  };

  const details = getDetails();
  const isConnectionRequired = activity.type === "connection_required";
  const authUrl = isConnectionRequired
    ? (activity.data.redirect_url as string)
    : null;

  return (
    <div className="mx-11 my-1">
      <button
        onClick={() => {
          if (authUrl) {
            window.open(authUrl, "_blank", "width=600,height=800");
          } else if (details) {
            setIsExpanded(!isExpanded);
          }
        }}
        className={cn(
          "flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs transition-colors",
          getBackgroundClass(),
          "text-muted-foreground",
          (details || authUrl) && "cursor-pointer",
        )}
      >
        <span
          className={cn(
            "shrink-0",
            activity.type === "connection_required" && "text-blue-600",
            activity.type === "connection_waiting" && "text-yellow-600",
            activity.type === "connection_established" && "text-green-600",
            activity.type === "connection_status" &&
              (activity.data.connected ? "text-green-600" : "text-orange-600"),
            !activity.type.startsWith("connection") && "text-amber-600",
          )}
        >
          {getIcon()}
        </span>
        <span className="flex-1 truncate">{getLabel()}</span>
        {authUrl && (
          <span className="shrink-0 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-medium text-white">
            Click to Authorize
          </span>
        )}
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
