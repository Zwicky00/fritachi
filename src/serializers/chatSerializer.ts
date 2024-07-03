import { CHAT_TYPE } from "../constants";
import { ChatDocument } from "../models/chatModel";

export interface addChatRequest {
  sender: string;
  reciever: string;
  kind: string;
  content: string;
  sentTime: string;
}

export function addChatSerializer(data: addChatRequest) {
  const finalFilters: any = {
    kind: data.kind,
    members: [],
    community: null,
    messageList: [
      {
        sender: data.sender,
        content: data.content,
        sentTime: data.sentTime,
      },
    ],
  };
  if (data.kind === CHAT_TYPE.USER) {
    finalFilters.members = [data.sender, data.reciever];
  } else {
    finalFilters.community = data.reciever;
  }
  return finalFilters;
}
