"use client";

import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";
import type { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/80 shadow-sm">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      )}

      {/* Message Content */}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          isUser
            ? "rounded-br-md bg-user-bubble text-user-bubble-foreground"
            : "rounded-bl-md bg-assistant-bubble text-assistant-bubble-foreground"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

/** Typing indicator shown while waiting for assistant response */
export function TypingIndicator() {
  return (
    <div className="flex w-full gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/80 shadow-sm">
        <Bot className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-assistant-bubble px-4 py-3">
        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
      </div>
    </div>
  );
}
