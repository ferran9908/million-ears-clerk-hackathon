"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * Hook to save memory to Convex after a successful Vapi call
 * Usage in your create page component:
 *
 * const saveMemory = useSaveMemory();
 *
 * // After successful call:
 * await saveMemory({
 *   name: "John Doe",
 *   phoneNumber: "+1234567890",
 *   callId: response.callId,
 *   customQuestions: "Tell me about your childhood"
 * });
 */
export function useSaveMemory() {
  const createMemory = useMutation(api.memories.createMemory as any);

  return async (data: {
    name: string;
    phoneNumber: string;
    callId?: string;
    customQuestions?: string;
  }) => {
    try {
      const memoryId = await createMemory({
        name: data.name,
        phoneNumber: data.phoneNumber,
        callId: data.callId,
        customQuestions: data.customQuestions,
      });

      return { success: true, memoryId };
    } catch (error) {
      console.error("Failed to save memory to Convex:", error);
      return { success: false, error };
    }
  };
}

/**
 * Hook to update memory with transcript and summary after call completes
 * Usage:
 *
 * const updateMemory = useUpdateMemory();
 *
 * // When you receive the transcript/summary:
 * await updateMemory({
 *   memoryId,
 *   transcript: "Full conversation...",
 *   summary: "AI-generated summary..."
 * });
 */
export function useUpdateMemory() {
  const updateMemory = useMutation(api.memories.updateMemory as any);

  return async (data: {
    memoryId: string;
    transcript?: string;
    summary?: string;
  }) => {
    try {
      await updateMemory({
        memoryId: data.memoryId as any,
        transcript: data.transcript,
        summary: data.summary,
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to update memory in Convex:", error);
      return { success: false, error };
    }
  };
}
