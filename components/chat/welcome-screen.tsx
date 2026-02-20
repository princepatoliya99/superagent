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
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        {/* Greeting */}
        <div className="mb-2 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
        </div>

        <h2 className="mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
          Hello there
        </h2>
        <p className="mb-10 text-lg text-muted-foreground">
          How can I help you today?
        </p>

        {/* Suggestion Chips */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onSuggestionClick(suggestion)}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-background px-5 py-4 text-left text-sm text-foreground shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md"
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
