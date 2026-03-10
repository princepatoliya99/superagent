"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/constants";

interface BackendHealthCheckProps {
  children: React.ReactNode;
}

export function BackendHealthCheck({ children }: BackendHealthCheckProps) {
  const [healthStatus, setHealthStatus] = useState<
    "checking" | "healthy" | "error"
  >("checking");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(`${API_BASE_URL}/health`, {
          method: "GET",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data.status === "ok") {
            setHealthStatus("healthy");
          } else {
            setHealthStatus("error");
            setErrorMessage("Backend service returned unhealthy status");
          }
        } else {
          setHealthStatus("error");
          setErrorMessage(
            `Backend service returned status ${response.status}: ${response.statusText}`,
          );
        }
      } catch (error) {
        setHealthStatus("error");
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            setErrorMessage(
              "Backend service is not responding (timeout after 10 seconds)",
            );
          } else {
            setErrorMessage(`Unable to connect to backend: ${error.message}`);
          }
        } else {
          setErrorMessage("Unable to connect to backend service");
        }
      }
    };

    checkBackendHealth();
  }, []);

  const handleRetry = () => {
    setHealthStatus("checking");
    setErrorMessage("");
    // Re-trigger the health check
    window.location.reload();
  };

  if (healthStatus === "checking") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Connecting to Backend
            </h2>
            <p className="text-sm text-muted-foreground">
              Checking backend service status...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (healthStatus === "error") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="max-w-md text-center space-y-6 p-6">
          <div className="flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Backend Service Not Running
            </h2>
            <p className="text-sm text-muted-foreground">
              Unable to connect to the backend service. Please make sure the
              backend is running.
            </p>
            {errorMessage && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-xs text-destructive font-mono">
                  {errorMessage}
                </p>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Retry Connection
            </button>
            <p className="text-xs text-muted-foreground">
              Backend URL: <span className="font-mono">{API_BASE_URL}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Backend is healthy, render children
  return <>{children}</>;
}
