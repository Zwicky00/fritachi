import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Chat, { ChatDocument } from "../models/chatModel";
import log from "../utils/logger";

export async function findAndUpdateChat(
  filter: FilterQuery<ChatDocument>,
  messageList: any
) {
  try {
    const chat = await Chat.findOne(filter);
    if (chat) {
      chat.messageList = [...chat.messageList, ...messageList];
      await chat.save();
      return chat;
    } else {
      const updatedQuery = {
        ...filter,
        messageList: messageList,
      };
      const writeChat = new Chat(updatedQuery);
      await writeChat.save();
      return writeChat;
    }
  } catch (error: any) {
    log.error("Could not update the user in database", error);
    throw new Error(error);
  }
}
