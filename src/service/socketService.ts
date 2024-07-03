import { verifyJwt } from "../utils/jwtUtils";
import {
  addChatRequest,
  addChatSerializer,
} from "../serializers/chatSerializer";
import { addChat } from "../controllers/chatControllers";
import log from "../utils/logger";

export function extractUserInfo(socketCookie: string | undefined) {
  const accessToken = socketCookie
    ?.split("; ")
    .find((cookie) => cookie.startsWith("accessToken="))
    ?.split("=")[1];
  if (accessToken) {
    const { valid, expired, decoded } = verifyJwt(accessToken as string);
    if (valid) {
      return decoded;
    }
  }
  return null;
}

export async function handleMessage(message: addChatRequest) {
  try {
    const filters = addChatSerializer(message);
    const savedChat = await addChat(filters);
    return {
      savedChat: savedChat,
      newMessage: filters,
    };
  } catch (error: any) {
    log.error(error);
    throw new Error("Could not save the chat");
  }
}
