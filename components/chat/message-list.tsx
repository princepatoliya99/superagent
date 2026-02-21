"use client";

import { useEffect, useRef } from "react";
import type { DisplayItem } from "@/types/chat";
import { MessageBubble, TypingIndicator } from "./message-bubble";
import { ToolActivityCard } from "./tool-activity";

interface MessageListProps {
  items: DisplayItem[];
  isLoading: boolean;
  onAuthCompleted?: () => void;
}

export function MessageList({
  items,
  isLoading,
  onAuthCompleted,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [items, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-4">
        {items.map((item, index) => {
          if (item.kind === "message") {
            return <MessageBubble key={`msg-${index}`} message={item.data} />;
          }
          return (
            <ToolActivityCard
              key={`tool-${index}`}
              activity={item.data}
              onAuthCompleted={onAuthCompleted}
            />
          );
        })}

        {isLoading && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
