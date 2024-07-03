import { get } from "lodash";
import { signJwt, verifyJwt } from "../utils/jwtUtils";
import Session from "../models/sessionModel";
import { ACCESS_TOKEN_TTL } from "../constants";
import { findUser } from "./userService";
import mongoose from "mongoose";

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJwt(refreshToken);

  if (!decoded || !get(decoded, "session")) return false;

  const session = await Session.findById(get(decoded, "session"));

  if (!session || !session.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: ACCESS_TOKEN_TTL }, // 15 minutes
  );

  return accessToken;
}

export async function createSession(
  userId: mongoose.Types.ObjectId,
  userAgent: string,
) {
  const session = await Session.create({ user: userId, userAgent });
  return session.toJSON();
}
