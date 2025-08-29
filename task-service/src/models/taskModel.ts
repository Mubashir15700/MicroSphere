import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  userId: string;
  createdAt: Date;
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "7d" },
});

// Indexes
TaskSchema.index({ userId: 1, createdAt: -1 });

export const Task = mongoose.model<ITask>("Task", TaskSchema);
