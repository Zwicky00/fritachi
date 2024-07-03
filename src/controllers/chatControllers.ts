import mongoose from "mongoose";
import { CHAT_TYPE } from "../constants";
import Chat from "../models/chatModel";
import Community from "../models/communityModel";
import log from "../utils/logger";
import { Request, Response } from "express";
import { findAndUpdateChat } from "../service/chatService";
import { filter } from "lodash";

export async function addChat(filters: any) {
  try {
    const query: any = {
      kind: filters.kind,
    };
    if (filters.kind === CHAT_TYPE.USER) {
      query.members = { $all: filters.members };
    } else {
      query.community = filters.community;
    }
    const newChat = await findAndUpdateChat(query, filters.messageList);
    return newChat;
  } catch (error) {
    log.error("Could not save the chat object", error);
    throw new Error("Could not save the chat object");
  }
}

export async function fetchAllChat(req: Request, res: Response) {
  try {
    const communities = await Community.find({
      memberList: { $in: [{ member: res.locals.user._id }] },
    });
    const memberList: mongoose.Types.ObjectId[] = [];
    communities.map((community) => {
      const members = community.memberList.map((memberObj) => memberObj.member);
      memberList.push(...members);
    });
    const communityIds = communities.map((community) => community._id);
    const allChat = await Chat.find({
      $or: [
        { community: { $in: communityIds } },
        { members: res.locals.user._id },
      ],
    });
    console.log(allChat);
    res.json(allChat);
  } catch (error) {
    console.log("Could not fetch chat from the database", error);
    res.status(500).send("Failed to fetch chat details");
  }
}
