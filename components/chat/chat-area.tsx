"use client";

import type { DisplayItem } from "@/types/chat";
import { ChatHeader } from "./chat-header";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { WelcomeScreen } from "./welcome-screen";

type ConnectionStatus = "disconnected" | "connecting" | "connected";

interface ChatAreaProps {
  displayItems: DisplayItem[];
  isLoading: boolean;
  hasConversation: boolean;
  onSend: (message: string) => void;
  onFileSelect?: (file: File) => void;
  onSuggestionClick: (suggestion: string) => void;
  onNewChat: () => void;
  connectionStatus: ConnectionStatus;
  onAuthCompleted?: () => void;
}

export function ChatArea({
  displayItems,
  isLoading,
  hasConversation,
  onSend,
  onFileSelect,
  onSuggestionClick,
  onNewChat,
  connectionStatus,
  onAuthCompleted,
}: ChatAreaProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background chat-surface">
      <ChatHeader onNewChat={onNewChat} connectionStatus={connectionStatus} />

      {hasConversation ? (
        <>
          <MessageList
            items={displayItems}
            isLoading={isLoading}
            onAuthCompleted={onAuthCompleted}
          />
          <ChatInput
            onSend={onSend}
            onFileSelect={onFileSelect}
            disabled={isLoading}
          />
        </>
      ) : (
        <>
          <WelcomeScreen onSuggestionClick={onSuggestionClick} />
          <ChatInput
            onSend={onSend}
            onFileSelect={onFileSelect}
            disabled={isLoading}
          />
        </>
      )}
    </div>
  );
}
