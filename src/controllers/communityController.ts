import { Request, Response } from "express";
import Community from "../models/communityModel";
import { communitySerializer } from "../serializers/communitySerializer";
import log from "../utils/logger";

export async function createCommunity(req: Request, res: Response) {
  try {
    const filters = communitySerializer(req.body);
    const newCommunity = new Community(filters);
    const savedCommunity = await newCommunity.save();
    res.json(savedCommunity);
  } catch (error) {
    log.error(error);
    res.status(500).send("Failed to create the community");
  }
}
