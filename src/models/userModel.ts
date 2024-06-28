import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  picture: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    picture: { type: String },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model<UserDocument>("User", UserSchema);
export default UserModel;
