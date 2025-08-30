import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ name: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
