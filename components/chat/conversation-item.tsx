"use client";

import { cn } from "@/lib/utils";
import { Trash2, MessageSquare } from "lucide-react";
import type { Conversation } from "@/types/chat";
import { useState } from "react";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
}: ConversationItemProps) {
  const [showDelete, setShowDelete] = useState(false);

  const preview =
    conversation.preview ||
    `Conversation ${conversation.conversation_id.slice(0, 8)}…`;

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      className={cn(
        "group flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
        isActive
          ? "bg-sidebar-active text-foreground"
          : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground"
      )}
    >
      <MessageSquare className="h-4 w-4 shrink-0 opacity-60" />

      <span className="flex-1 truncate">{preview}</span>

      {showDelete && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.stopPropagation();
              onDelete();
            }
          }}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </span>
      )}
    </button>
  );
}
