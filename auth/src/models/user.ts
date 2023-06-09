import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  googleId: string;
  githubId: string;
  posts: Schema.Types.ObjectId[];
  comments: Schema.Types.ObjectId[];
  postsBannedFrom: Schema.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
  username: { type: String },
  googleId: { type: String },
  githubId: { type: String },
  email: { type: String, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  postsBannedFrom: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

export const User = mongoose.model<IUser>('User', UserSchema);
