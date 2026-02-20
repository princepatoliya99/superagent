"use client";

import { useState, useCallback, useEffect } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import { API_BASE_URL } from "@/lib/constants";
import type {
  Conversation,
  Message,
  DisplayItem,
  ToolActivity,
  ChatEvent,
} from "@/types/chat";
import { Sidebar } from "./sidebar";
import { ChatArea } from "./chat-area";

export function ChatLayout() {
  // ── State ──
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [displayItems, setDisplayItems] = useState<DisplayItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ── Fetch conversation list ──
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/chat/conversations`);
      if (res.ok) {
        const data: Conversation[] = await res.json();
        setConversations(data);
      }
    } catch {
      // Backend might not be running — that's fine
    }
  }, []);

  // ── Fetch history for a conversation ──
  const fetchHistory = useCallback(async (conversationId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/chat/${conversationId}/history`);
      if (res.ok) {
        const history: { role: string; content: string }[] = await res.json();
        const items: DisplayItem[] = history
          .filter((h) => h.role === "user" || h.role === "assistant")
          .map((h, i) => ({
            kind: "message" as const,
            data: {
              id: `hist-${i}`,
              role: h.role as "user" | "assistant",
              content: h.content,
              timestamp: new Date(),
            },
          }));
        setDisplayItems(items);
      }
    } catch {
      // Ignore errors
    }
  }, []);

  // ── WebSocket event handler ──
  const handleEvent = useCallback((event: ChatEvent) => {
    switch (event.type) {
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

        // Update conversation ID if new
        if (event.data.conversation_id) {
          setActiveConversationId(event.data.conversation_id as string);
        }
        break;
      }
      case "error": {
        const errorMsg: Message = {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `⚠️ Error: ${event.data.message || "Something went wrong"}`,
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
    autoConnect: true,
  });

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // ── Actions ──
  const handleSend = useCallback(
    (message: string) => {
      // Add user message to display
      const userMsg: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: message,
        timestamp: new Date(),
      };
      setDisplayItems((prev) => [...prev, { kind: "message", data: userMsg }]);
      setIsLoading(true);

      // Send via WebSocket
      sendMessage(message, "default", activeConversationId || undefined);

      // Update conversation preview if this is the first message
      if (!activeConversationId) {
        // Will be set by the reply event
      }
    },
    [sendMessage, activeConversationId],
  );

  const handleNewChat = useCallback(() => {
    setActiveConversationId(null);
    setDisplayItems([]);
    setIsLoading(false);
    // Refresh conversation list
    fetchConversations();
  }, [fetchConversations]);

  const handleSelectConversation = useCallback(
    (id: string) => {
      setActiveConversationId(id);
      setDisplayItems([]);
      setIsLoading(false);
      fetchHistory(id);
    },
    [fetchHistory],
  );

  const handleDeleteConversation = useCallback(
    async (id: string) => {
      try {
        await fetch(`${API_BASE_URL}/chat/${id}`, { method: "DELETE" });
        setConversations((prev) =>
          prev.filter((c) => c.conversation_id !== id),
        );
        if (activeConversationId === id) {
          setActiveConversationId(null);
          setDisplayItems([]);
        }
      } catch {
        // Ignore errors
      }
    },
    [activeConversationId],
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      handleSend(suggestion);
    },
    [handleSend],
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar
        conversations={conversations}
        activeId={activeConversationId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
        onDelete={handleDeleteConversation}
      />

      <ChatArea
        sidebarOpen={sidebarOpen}
        displayItems={displayItems}
        isLoading={isLoading}
        hasConversation={displayItems.length > 0}
        onSend={handleSend}
        onSuggestionClick={handleSuggestionClick}
      />
    </div>
  );
}
