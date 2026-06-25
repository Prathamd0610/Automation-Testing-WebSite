import { z } from 'zod';

/** Submit feedback / a feature request. Email + name are taken from the session. */
export const createFeedbackSchema = z.object({
  type: z.enum(['comment', 'feature', 'bug', 'other']).default('comment'),
  subject: z.string().min(3).max(160),
  message: z.string().min(5).max(2000),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  pageUrl: z.string().max(300).optional(),
});

/** Admin: update the workflow status of a feedback item. */
export const updateFeedbackStatusSchema = z.object({
  status: z.enum(['open', 'in_review', 'resolved']),
});
