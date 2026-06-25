import { Schema, model, type HydratedDocument, type Types } from 'mongoose';

export type FeedbackType = 'comment' | 'feature' | 'bug' | 'other';
export type FeedbackPriority = 'low' | 'medium' | 'high';
export type FeedbackStatus = 'open' | 'in_review' | 'resolved';

export interface IFeedback {
  user?: Types.ObjectId;
  name: string;
  email: string;
  type: FeedbackType;
  subject: string;
  message: string;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  pageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FeedbackDocument = HydratedDocument<IFeedback>;

const feedbackSchema = new Schema<IFeedback>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    type: {
      type: String,
      enum: ['comment', 'feature', 'bug', 'other'],
      default: 'comment',
      index: true,
    },
    subject: { type: String, required: true, trim: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['open', 'in_review', 'resolved'], default: 'open', index: true },
    pageUrl: { type: String, maxlength: 300 },
  },
  { timestamps: true },
);

feedbackSchema.index({ createdAt: -1 });

export const Feedback = model<IFeedback>('Feedback', feedbackSchema);
