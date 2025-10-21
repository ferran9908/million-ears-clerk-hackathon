"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { History, MessageSquare, Plus } from "lucide-react";
import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ChatInterface } from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

/**
 * Explore page - AI chat interface for querying family memories
 * Users can ask questions about their recorded memories and get AI-powered insights
 */
export default function ExplorePage() {
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const createThread = useMutation(api.chat.createThread as any);
  const threads = useQuery(api.chat.listThreads as any);

  const handleCreateThread = async () => {
    try {
      const thread = await createThread();
      setCurrentThreadId(thread._id);
      setIsHistoryOpen(false);
    } catch (error) {
      console.error("Failed to create thread:", error);
    }
  };

  const handleSelectThread = (threadId: string) => {
    setCurrentThreadId(threadId);
    setIsHistoryOpen(false);
  };

  return (
    <div className="absolute inset-0 top-16">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="h-[calc(100vh-4rem)] flex flex-col">
            <SignedOut>
              <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
                <MessageSquare className="h-16 w-16 text-muted-foreground" />
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold">
                    Explore Your Family Memories
                  </h2>
                  <p className="text-muted-foreground max-w-md">
                    Sign in to start asking questions about your recorded family
                    memories and discover insights with AI.
                  </p>
                </div>
                <SignInButton mode="modal">
                  <Button size="lg">Sign In to Continue</Button>
                </SignInButton>
              </div>
            </SignedOut>

            <SignedIn>
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="border-b p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    <h1 className="text-xl font-semibold">Memory Explorer</h1>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCreateThread}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      New Chat
                    </Button>
                    <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <History className="h-4 w-4" />
                          History
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Chat History</SheetTitle>
                          <SheetDescription>
                            View and continue previous conversations
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 space-y-2">
                          {threads === undefined ? (
                            <>
                              <Skeleton className="h-16 w-full" />
                              <Skeleton className="h-16 w-full" />
                              <Skeleton className="h-16 w-full" />
                            </>
                          ) : threads.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">
                              <p>No conversations yet</p>
                            </div>
                          ) : (
                            threads.map((thread: any) => (
                              <Button
                                key={thread._id}
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left h-auto py-3",
                                  currentThreadId === thread._id &&
                                    "border-primary bg-primary/10"
                                )}
                                onClick={() => handleSelectThread(thread._id)}
                              >
                                <div className="flex flex-col gap-1 overflow-hidden">
                                  <div className="font-medium truncate">
                                    Conversation
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {format(
                                      new Date(thread._creationTime),
                                      "MMM d, yyyy h:mm a"
                                    )}
                                  </div>
                                </div>
                              </Button>
                            ))
                          )}
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>

                {/* Chat Interface */}
                <div className="flex-1 overflow-hidden">
                  <ChatInterface
                    threadId={currentThreadId}
                    onCreateThread={handleCreateThread}
                  />
                </div>
              </div>
            </SignedIn>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
