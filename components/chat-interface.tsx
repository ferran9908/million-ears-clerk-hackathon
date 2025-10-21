"use client";

import { useUIMessages } from "@convex-dev/agent/react";
import { useAction } from "convex/react";
import { Loader2, MessageSquare, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatInput } from "@/components/chat-input";
import { ChatMessage } from "@/components/chat-message";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

interface ChatInterfaceProps {
  threadId: string | null;
  onCreateThread: () => void;
}

/**
 * Main chat interface component with message list and input
 */
export function ChatInterface({
  threadId,
  onCreateThread,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
  const prevMessageCountRef = useRef(0);

  const sendMessage = useAction(api.chat.sendMessage as any);

  // Fetch messages with streaming support
  const {
    results: messages,
    status,
    loadMore,
  } = useUIMessages(
    api.chat.listMessages as any,
    threadId ? { threadId } : "skip",
    { initialNumItems: 50, stream: true }
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length !== prevMessageCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      prevMessageCountRef.current = messages.length;
    }
  });

  const handleSendMessage = async (message: string) => {
    if (!threadId || isSending) return;

    setIsSending(true);
    try {
      await sendMessage({ threadId, message });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  // No thread selected state
  if (!threadId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
        <MessageSquare className="h-16 w-16 text-muted-foreground" />
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Welcome to Memory Explorer</h2>
          <p className="text-muted-foreground max-w-md">
            Start a new conversation to ask questions about your family
            memories. I can help you explore, summarize, and discover insights
            from your recorded stories.
          </p>
        </div>
        <Button onClick={onCreateThread} size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Start New Conversation
        </Button>
      </div>
    );
  }

  // Loading state
  if (status === "LoadingFirstPage") {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <p>No messages yet. Start by asking a question!</p>
            </div>
          )}

          {messages.map((message: any) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {status === "CanLoadMore" && (
            <div className="flex justify-center py-2">
              <Button variant="outline" size="sm" onClick={() => loadMore(20)}>
                Load More
              </Button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t p-4 bg-background">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isSending}
          placeholder={
            isSending ? "Sending..." : "Ask about your family memories..."
          }
        />
      </div>
    </div>
  );
}
