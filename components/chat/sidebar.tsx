"use client";

import { cn } from "@/lib/utils";
import { MessageSquarePlus, PanelLeftClose, PanelLeft } from "lucide-react";
import type { Conversation } from "@/types/chat";
import { ConversationItem } from "./conversation-item";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
}

export function Sidebar({
  conversations,
  activeId,
  isOpen,
  onToggle,
  onSelect,
  onNewChat,
  onDelete,
}: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/20 md:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-30 flex h-full w-[280px] flex-col border-r border-border bg-sidebar-bg transition-transform duration-300 ease-in-out md:relative md:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:border-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-14 items-center justify-between border-b border-border px-3">
          <button
            onClick={onToggle}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-hover hover:text-foreground"
            aria-label="Close sidebar"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>

          <button
            onClick={onNewChat}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-hover hover:text-foreground"
            aria-label="New chat"
          >
            <MessageSquarePlus className="h-5 w-5" />
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {conversations.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No conversations yet
            </div>
          ) : (
            <div className="space-y-0.5">
              {conversations.map((conv) => (
                <ConversationItem
                  key={conv.conversation_id}
                  conversation={conv}
                  isActive={activeId === conv.conversation_id}
                  onSelect={() => onSelect(conv.conversation_id)}
                  onDelete={() => onDelete(conv.conversation_id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-border px-3 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              S
            </div>
            <span className="text-sm font-medium text-foreground">
              SuperAgent
            </span>
          </div>
        </div>
      </aside>

      {/* Collapsed sidebar toggle (when sidebar is hidden on desktop) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:absolute"
          aria-label="Open sidebar"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
