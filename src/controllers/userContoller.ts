import { Request, Response } from "express";
import User from "../models/userModel";
import Community from "../models/communityModel";
import log from "../utils/logger";

export async function getCurrentUser(req: Request, res: Response) {
  return res.send(res.locals.user);
}

export async function fetchMultiUserDetails(req: Request, res: Response) {
  try {
    const parsedRequests = req.body.dataRequest;
    const communityRequests: string[] = parsedRequests.communityRequests;
    const communities = await Community.find({
      _id: { $in: communityRequests },
    }).populate("memberList.member");
    const userRequests = [
      ...communities.flatMap((community) =>
        community.memberList.map((element) => element.member.toString())
      ),
      ...parsedRequests.userRequests,
    ];
    const users = await User.find({
      _id: { $in: userRequests },
    }).select("name email picture");
    const userRecord: Record<string, any> = {};
    users.map((element) => {
      userRecord[element._id as string] = element;
    });
    const communityRecord: Record<string, any> = {};
    communities.map((element) => {
      communityRecord[element._id as string] = element;
    });
    res.json({
      users: userRecord,
      communities: communityRecord,
    });
  } catch (error) {
    log.error(error);
    res.status(403).send("Invalid Request");
  }
}
