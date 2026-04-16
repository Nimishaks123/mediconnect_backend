import { z } from "zod";

export const SendMessageSchema = z.object({
  body: z.object({
    receiverId: z.string().min(1, "Receiver ID is required"),
    conversationId: z.string().min(1, "Conversation ID is required"),
    content: z.string().min(1, "Message content is required"),
  })
});

export const GetMessagesSchema = z.object({
  params: z.object({
    conversationId: z.string().min(1, "Conversation ID is required"),
  }),
  query: z.object({
    page: z.preprocess((val) => val ? parseInt(val as string) : 1, z.number().min(1).default(1)),
    limit: z.preprocess((val) => val ? parseInt(val as string) : 50, z.number().min(1).max(100).default(50)),
  })
});

export const GetConversationsSchema = z.object({
  query: z.object({
    page: z.preprocess((val) => val ? parseInt(val as string) : 1, z.number().min(1).default(1)),
    limit: z.preprocess((val) => val ? parseInt(val as string) : 50, z.number().min(1).max(100).default(50)),
  }).optional().default({ page: 1, limit: 50 })
});

export const MarkAsReadSchema = z.object({
  params: z.object({
    conversationId: z.string().min(1, "Conversation ID is required"),
  })
});
