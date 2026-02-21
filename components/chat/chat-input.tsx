"use client";

import { useRef, useState, useCallback, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { ArrowUp, Plus } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onFileSelect?: (file: File) => void;
  disabled?: boolean;
}

export function ChatInput({
  onSend,
  onFileSelect,
  disabled = false,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setValue("");

    // Reset textarea height
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    });
  }, [value, disabled, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onFileSelect) {
        onFileSelect(file);
      }
      // Reset so the same file can be re-selected
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [onFileSelect],
  );

  return (
    <div className="border-t border-border bg-background px-4 py-4">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-muted/50 px-4 py-2 shadow-sm transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
            aria-label="Select PDF file"
            title="Select PDF file"
          />

          {/* Plus button for PDF upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all",
              disabled
                ? "cursor-not-allowed opacity-50"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            aria-label="Upload PDF"
            title="Upload PDF to knowledge base"
          >
            <Plus className="h-4 w-4" />
          </button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              adjustHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Message SuperAgent..."
            rows={1}
            disabled={disabled}
            className={cn(
              "flex-1 resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none",
              "max-h-[200px] min-h-[24px]",
              disabled && "cursor-not-allowed opacity-50",
            )}
          />

          <button
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all",
              value.trim() && !disabled
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                : "bg-muted text-muted-foreground",
            )}
            aria-label="Send message"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-2 text-center text-[11px] text-muted-foreground/60">
          SuperAgent may produce inaccurate information. Verify important
          details.
        </p>
      </div>
    </div>
  );
}
