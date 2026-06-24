import { Schema, model, type HydratedDocument } from 'mongoose';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface ITask {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  order: number;
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type TaskDocument = HydratedDocument<ITask>;

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: '', maxlength: 2000 },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'review', 'done'],
      default: 'todo',
      index: true,
    },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    assignee: { type: String, trim: true },
    order: { type: Number, default: 0 },
    dueDate: { type: Date },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const Task = model<ITask>('Task', taskSchema);
