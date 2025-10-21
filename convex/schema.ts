import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  calls: defineTable({
    phoneNumber: v.string(),
    name: v.string(),
    question: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("failed")
    ),
    vapiCallId: v.optional(v.string()),
    transcript: v.optional(v.string()),
    userId: v.optional(v.string()),
    familyMemberName: v.optional(v.string()),
  }),
});
