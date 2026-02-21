"use client";

import { useState, useCallback, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface UserIdDialogProps {
  onSubmit: (userId: string) => void;
}

export function UserIdDialog({ onSubmit }: UserIdDialogProps) {
  const [value, setValue] = useState("");

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }, [value, onSubmit]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/20 backdrop-blur-sm sm:items-center">
      <div className="w-full rounded-t-2xl border border-border bg-card px-5 pb-6 pt-5 shadow-lg sm:mx-4 sm:max-w-sm sm:rounded-2xl sm:p-6">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted sm:h-14 sm:w-14">
            <User className="h-6 w-6 text-foreground sm:h-7 sm:w-7" />
          </div>

          <div className="text-center">
            <h3 className="text-base font-semibold text-foreground sm:text-lg">
              Welcome to SuperAgent
            </h3>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Enter your user ID to get started.
            </p>
          </div>

          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. john_doe"
            autoFocus
            className={cn(
              "w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground",
              "placeholder:text-muted-foreground/60 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20",
            )}
          />

          <button
            onClick={handleSubmit}
            disabled={!value.trim()}
            className={cn(
              "w-full rounded-xl px-4 py-3 text-sm font-medium transition-all sm:py-2.5",
              value.trim()
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98]"
                : "bg-muted text-muted-foreground cursor-not-allowed",
            )}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
