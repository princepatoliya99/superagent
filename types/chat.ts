// ── Message & Conversation Types ──

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ToolSearchEvent {
  query: string;
  tools_found: number;
  toolkits?: string[];
}

export interface ToolCallEvent {
  name: string;
  arguments: Record<string, unknown>;
}

export interface ToolResultEvent {
  name: string;
  result: Record<string, unknown>;
}

export interface RagContextEvent {
  results_count: number;
}

export interface ConnectionStatusEvent {
  toolkit: string;
  connected: boolean;
  requires_auth: boolean;
}

export interface ConnectionRequiredEvent {
  toolkit: string;
  redirect_url: string;
  connection_request_id?: string;
  message: string;
}

export interface ConnectionWaitingEvent {
  toolkit: string;
  message: string;
}

export interface ConnectionEstablishedEvent {
  toolkit: string;
  message: string;
}

export type ToolActivity =
  | { type: "rag_context"; data: RagContextEvent }
  | { type: "tool_search"; data: ToolSearchEvent }
  | { type: "tool_call"; data: ToolCallEvent }
  | { type: "tool_result"; data: ToolResultEvent }
  | { type: "connection_status"; data: ConnectionStatusEvent }
  | { type: "connection_required"; data: ConnectionRequiredEvent }
  | { type: "connection_waiting"; data: ConnectionWaitingEvent }
  | { type: "connection_established"; data: ConnectionEstablishedEvent };

export interface ChatEvent {
  type:
    | "rag_context"
    | "tool_search"
    | "tool_call"
    | "tool_result"
    | "reply"
    | "error"
    | "connection_status"
    | "connection_required"
    | "connection_waiting"
    | "connection_established";
  data: Record<string, unknown>;
}

export interface Conversation {
  conversation_id: string;
  message_count: number;
  created_at: string;
  last_message_at: string;
  /** Client-side only: preview of first user message */
  preview?: string;
}

export interface ConversationMessages {
  messages: Message[];
  toolActivities: ToolActivity[];
  /** Interleaved display items for rendering */
  displayItems: DisplayItem[];
}

export type DisplayItem =
  | { kind: "message"; data: Message }
  | { kind: "tool"; data: ToolActivity };
