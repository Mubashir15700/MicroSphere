import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  assigneeId?: mongoose.Types.ObjectId;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    assigneeId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    dueDate: {
      type: Date,
      required: false,
      default: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

// TTL index (7 days after createdAt)
// TaskSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

// Query optimization index
TaskSchema.index({ assigneeId: 1, createdAt: -1 });

// Unique compound index
TaskSchema.index({ assigneeId: 1, title: 1 }, { unique: true });

const Task = mongoose.model<ITask>('Task', TaskSchema);

export default Task;
