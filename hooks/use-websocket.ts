"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WS_URL } from "@/lib/constants";
import type { ChatEvent } from "@/types/chat";

interface UseWebSocketOptions {
  onEvent?: (event: ChatEvent) => void;
  autoConnect?: boolean;
}

type ConnectionStatus = "disconnected" | "connecting" | "connected";

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { onEvent, autoConnect = true } = options;
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const reconnectAttempts = useRef(0);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  const connect = useCallback(() => {
    // Don't connect if already connected or connecting
    if (
      wsRef.current?.readyState === WebSocket.OPEN ||
      wsRef.current?.readyState === WebSocket.CONNECTING
    ) {
      return;
    }

    setStatus("connecting");

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      setStatus("connected");
      reconnectAttempts.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const parsed: ChatEvent = JSON.parse(event.data);
        onEventRef.current?.(parsed);
      } catch {
        console.error("Failed to parse WebSocket message:", event.data);
      }
    };

    ws.onclose = () => {
      setStatus("disconnected");
      wsRef.current = null;

      // Reconnect with exponential backoff (max 10s)
      const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 10000);
      reconnectAttempts.current += 1;
      reconnectTimeout.current = setTimeout(() => {
        connect();
      }, delay);
    };

    ws.onerror = () => {
      ws.close();
    };

    wsRef.current = ws;
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    reconnectAttempts.current = 0;
    wsRef.current?.close();
    wsRef.current = null;
    setStatus("disconnected");
  }, []);

  const sendMessage = useCallback(
    (message: string, userId: string, conversationId?: string) => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        console.warn("WebSocket is not connected");
        return;
      }

      const payload: Record<string, string> = {
        message,
        user_id: userId,
      };
      if (conversationId) {
        payload.conversation_id = conversationId;
      }

      wsRef.current.send(JSON.stringify(payload));
    },
    [],
  );

  const sendRaw = useCallback((payload: Record<string, unknown>) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket is not connected");
      return;
    }
    wsRef.current.send(JSON.stringify(payload));
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      wsRef.current?.close();
    };
  }, [autoConnect, connect]);

  return { status, connect, disconnect, sendMessage, sendRaw };
}
