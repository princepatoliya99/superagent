"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { FileText, Loader2, CheckCircle, X, AlertCircle } from "lucide-react";
import { uploadPdf } from "@/lib/rag-api";

type UploadStatus = "preview" | "uploading" | "success" | "error";

interface PdfUploadDialogProps {
  file: File;
  onClose: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function PdfUploadDialog({ file, onClose }: PdfUploadDialogProps) {
  const [status, setStatus] = useState<UploadStatus>("preview");
  const [chunks, setChunks] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpload = useCallback(async () => {
    setStatus("uploading");
    setErrorMsg("");

    try {
      const result = await uploadPdf(file);
      setChunks(result.num_chunks);
      setStatus("success");

      // Auto-close after 2 seconds on success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Upload failed");
      setStatus("error");
    }
  }, [file, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={status === "uploading" ? undefined : onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
        {/* Close button */}
        {status !== "uploading" && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Preview / Uploading state */}
        {(status === "preview" || status === "uploading") && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
              <FileText className="h-7 w-7 text-foreground" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-semibold text-foreground">
                Upload PDF
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                This file will be processed and added to the knowledge base.
              </p>
            </div>

            <div className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3">
              <p className="truncate text-sm font-medium text-foreground">
                {file.name}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>

            <div className="flex w-full gap-3">
              <button
                onClick={onClose}
                disabled={status === "uploading"}
                className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={status === "uploading"}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                  "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
                  "disabled:cursor-not-allowed disabled:opacity-70",
                )}
              >
                {status === "uploading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading…
                  </>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Success state */}
        {status === "success" && (
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle className="h-7 w-7 text-emerald-600" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-semibold text-foreground">
                Upload Complete
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{file.name}</span>{" "}
                was split into{" "}
                <span className="font-medium text-foreground">
                  {chunks} chunks
                </span>{" "}
                and added to the knowledge base.
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {status === "error" && (
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-semibold text-foreground">
                Upload Failed
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{errorMsg}</p>
            </div>
            <div className="flex w-full gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Close
              </button>
              <button
                onClick={handleUpload}
                className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
