"use client";

import { useState, useCallback } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import type {
  Message,
  DisplayItem,
  ToolActivity,
  ChatEvent,
} from "@/types/chat";
import { ChatArea } from "./chat-area";
import { PdfUploadDialog } from "./pdf-upload-dialog";
import { UserIdDialog } from "./user-id-dialog";

export function ChatLayout() {
  const [userId, setUserId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [displayItems, setDisplayItems] = useState<DisplayItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // PDF upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const handleEvent = useCallback((event: ChatEvent) => {
    switch (event.type) {
      case "rag_context":
      case "tool_search":
      case "tool_call":
      case "tool_result":
      case "connection_status":
      case "connection_required":
      case "connection_waiting":
      case "connection_established": {
        const toolActivity = {
          type: event.type,
          data: event.data,
        } as unknown as ToolActivity;
        setDisplayItems((prev) => [
          ...prev,
          { kind: "tool", data: toolActivity },
        ]);
        break;
      }
      case "reply": {
        const reply: Message = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: (event.data.content as string) || "",
          timestamp: new Date(),
        };
        setDisplayItems((prev) => [...prev, { kind: "message", data: reply }]);
        setIsLoading(false);

        if (event.data.conversation_id) {
          setActiveConversationId(event.data.conversation_id as string);
        }
        break;
      }
      case "error": {
        const errorMsg: Message = {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `Error: ${event.data.message || "Something went wrong"}`,
          timestamp: new Date(),
        };
        setDisplayItems((prev) => [
          ...prev,
          { kind: "message", data: errorMsg },
        ]);
        setIsLoading(false);
        break;
      }
    }
  }, []);

  const { sendMessage, status } = useWebSocket({
    onEvent: handleEvent,
    autoConnect: !!userId,
  });

  const handleSend = useCallback(
    (message: string) => {
      if (!userId) return;
      const userMsg: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: message,
        timestamp: new Date(),
      };
      setDisplayItems((prev) => [...prev, { kind: "message", data: userMsg }]);
      setIsLoading(true);
      sendMessage(message, userId, activeConversationId || undefined);
    },
    [sendMessage, activeConversationId, userId],
  );

  const handleNewChat = useCallback(() => {
    setActiveConversationId(null);
    setDisplayItems([]);
    setIsLoading(false);
  }, []);

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      handleSend(suggestion);
    },
    [handleSend],
  );

  const handleFileSelect = useCallback((file: File) => {
    setUploadFile(file);
  }, []);

  const handleUploadClose = useCallback(() => {
    setUploadFile(null);
  }, []);

  const handleUserIdSubmit = useCallback((id: string) => {
    setUserId(id);
  }, []);

  // Show user ID dialog before anything else
  if (!userId) {
    return <UserIdDialog onSubmit={handleUserIdSubmit} />;
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <ChatArea
        displayItems={displayItems}
        isLoading={isLoading}
        hasConversation={displayItems.length > 0}
        onSend={handleSend}
        onFileSelect={handleFileSelect}
        onSuggestionClick={handleSuggestionClick}
        onNewChat={handleNewChat}
        connectionStatus={status}
      />

      {uploadFile && (
        <PdfUploadDialog file={uploadFile} onClose={handleUploadClose} />
      )}
    </div>
  );
}
