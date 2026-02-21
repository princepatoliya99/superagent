"use client";

import { Sparkles, ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  "What can you help me with?",
  "Search my recent emails",
  "Tell me about your capabilities",
  "Help me draft a message",
];

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary/80 shadow-md">
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>
        </div>

        <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Hello there
        </h2>
        <p className="mb-12 text-lg text-muted-foreground">
          How can I help you today?
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onSuggestionClick(suggestion)}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-left text-sm text-foreground shadow-sm transition-all hover:border-border hover:bg-accent hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="flex-1">{suggestion}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
