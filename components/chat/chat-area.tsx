"use client";

import type { DisplayItem } from "@/types/chat";
import { ChatHeader } from "./chat-header";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { WelcomeScreen } from "./welcome-screen";

interface ChatAreaProps {
  sidebarOpen: boolean;
  displayItems: DisplayItem[];
  isLoading: boolean;
  hasConversation: boolean;
  onSend: (message: string) => void;
  onSuggestionClick: (suggestion: string) => void;
}

export function ChatArea({
  sidebarOpen,
  displayItems,
  isLoading,
  hasConversation,
  onSend,
  onSuggestionClick,
}: ChatAreaProps) {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <ChatHeader sidebarOpen={sidebarOpen} />

      {hasConversation ? (
        <>
          <MessageList items={displayItems} isLoading={isLoading} />
          <ChatInput onSend={onSend} disabled={isLoading} />
        </>
      ) : (
        <>
          <WelcomeScreen onSuggestionClick={onSuggestionClick} />
          <ChatInput onSend={onSend} disabled={isLoading} />
        </>
      )}
    </div>
  );
}
