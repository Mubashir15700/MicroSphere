import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  userId: mongoose.Types.ObjectId;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true, maxlength: 100, unique: true },
    description: { type: String, trim: true, maxlength: 500 },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// TTL index (7 days after createdAt)
TaskSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

// Query optimization index
TaskSchema.index({ userId: 1, createdAt: -1 });

// Unique compound index
TaskSchema.index({ userId: 1, title: 1 }, { unique: true });

export const Task = mongoose.model<ITask>('Task', TaskSchema);
