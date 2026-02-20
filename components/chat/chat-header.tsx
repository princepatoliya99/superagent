"use client";

import { Sparkles } from "lucide-react";

interface ChatHeaderProps {
  sidebarOpen: boolean;
}

export function ChatHeader({ sidebarOpen }: ChatHeaderProps) {
  return (
    <header className="flex h-14 items-center border-b border-border bg-background px-4">
      {/* Spacer for sidebar toggle button when sidebar is closed */}
      {!sidebarOpen && <div className="w-10" />}

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <h1 className="text-base font-semibold text-foreground">SuperAgent</h1>
      </div>
    </header>
  );
}
