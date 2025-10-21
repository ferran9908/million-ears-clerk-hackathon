"use client";

import type { UIMessage } from "@convex-dev/agent/react";
import { useSmoothText } from "@convex-dev/agent/react";
import { Bot, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: UIMessage;
}

/**
 * Renders a single chat message with smooth text streaming
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const [visibleText] = useSmoothText(message.text, {
    startStreaming: message.status === "streaming",
  });

  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-lg",
        isUser ? "bg-primary/10" : "bg-muted/50"
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">
            {isUser ? "You" : "AI Assistant"}
          </p>
          {message.status === "streaming" && (
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
        </div>
        <div className="text-sm text-muted-foreground whitespace-pre-wrap">
          {visibleText}
        </div>
      </div>
    </div>
  );
}
