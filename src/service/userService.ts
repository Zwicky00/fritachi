import axios from "axios";
import { GOOGLE_TOKEN_URL, GOOGLE_USER_INFO_URL } from "../constants";
import qs from "qs";
import log from "../utils/logger";
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import UserModel, { UserDocument } from "../models/userModel";

interface GoogleTokensResult {
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}
interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export async function getGoogleOAuthTokens({
  code,
}: {
  code: string;
}): Promise<GoogleTokensResult> {
  const url = GOOGLE_TOKEN_URL;
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
    grant_type: "authorization_code",
  };
  try {
    const res = await axios.post<GoogleTokensResult>(
      url,
      qs.stringify(values),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    return res.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getGoogleUser({
  id_token,
  access_token,
}: {
  id_token: string;
  access_token: string;
}): Promise<GoogleUserResult> {
  try {
    const userInfoUrl = `${GOOGLE_USER_INFO_URL}?alt=json&access_token=${access_token}`;
    const res = await axios.get<GoogleUserResult>(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    log.error(error, "Error fetching Google user");
    throw new Error(error.message);
  }
}

export async function findAndUpdateUser(
  filter: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options: QueryOptions = {},
) {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      filter,
      update,
      options,
    );
    return updatedUser;
  } catch (error: any) {
    log.error("Could not update the user in database");
    throw new Error(error.message);
  }
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}
