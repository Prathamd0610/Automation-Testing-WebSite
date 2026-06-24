import { Schema, model, type HydratedDocument } from 'mongoose';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface INotification {
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  recipient?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationDocument = HydratedDocument<INotification>;

const notificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info',
      index: true,
    },
    read: { type: Boolean, default: false, index: true },
    recipient: { type: String, lowercase: true, trim: true, index: true },
  },
  { timestamps: true },
);

export const Notification = model<INotification>('Notification', notificationSchema);
