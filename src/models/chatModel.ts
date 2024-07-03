import mongoose from "mongoose";
import { CHAT_TYPE } from "../constants";

export interface ChatDocument extends mongoose.Document {
  kind: string;
  members: string[];
  community: string;
  messageList: {
    sender: string;
    content: string;
    sentTime: string;
  }[];
}

const ChatSchema = new mongoose.Schema({
  kind: {
    type: String,
    enum: [CHAT_TYPE.USER, CHAT_TYPE.COMMUNITY],
  },
  members: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: CHAT_TYPE.USER,
      },
    ],
    default: [],
  },
  community: {
    type: mongoose.Types.ObjectId,
    ref: CHAT_TYPE.COMMUNITY,
    default: null,
  },
  messageList: [
    {
      sender: {
        type: mongoose.Types.ObjectId,
        ref: CHAT_TYPE.USER,
        required: true,
      },
      content: String,
      sentTime: String,
    },
  ],
});
const Chat = mongoose.model<ChatDocument>("Chat", ChatSchema);

export default Chat;
