import mongoose from "mongoose";

interface member extends mongoose.Document {
  member: mongoose.Types.ObjectId;
  role: String;
}

export interface CommunityDocument extends mongoose.Document {
  name: string;
  memberList: member[];
}

const CommunitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  memberList: [
    {
      member: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        enum: ["admin", "member"],
      },
    },
  ],
});

const Community = mongoose.model<CommunityDocument>(
  "Community",
  CommunitySchema
);
export default Community;
