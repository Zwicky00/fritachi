
import { CookieOptions, Request, Response } from 'express';
import { findAndUpdateUser, getGoogleOAuthTokens, getGoogleUser } from '../service/userService';
import log from '../utils/logger';
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from '../constants';
import { signJwt } from '../utils/jwtUtils';
import { createSession } from '../service/sessionService';
import mongoose from 'mongoose';
import { UserDocument } from '../models/userModel';

const ORIGIN = process.env.ORIGIN as string;

const accessTokenCookieOptions: CookieOptions = {
    maxAge: 900000, // 15 mins
    httpOnly: true,
    domain: "localhost",
    path: "/",
    sameSite: "lax",
    secure: false,
};

const refreshTokenCookieOptions: CookieOptions = {
    ...accessTokenCookieOptions,
    maxAge: 3.154e10, // 1 year
};

export async function googleOauthHandler(req: Request, res : Response) {
    const code = req.query.code as string;
    try{
        const {id_token, access_token} = await getGoogleOAuthTokens({code});
        const googleUser = await getGoogleUser({id_token, access_token});
        if(!googleUser.verified_email){
            return res.status(403).send('Google account is not verified');
        }
        const user = await findAndUpdateUser({
            email: googleUser.email,
        },{
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
        },{
            upsert: true,
            new: true,
        });
        if(user){
            const session = await createSession(user._id as mongoose.Types.ObjectId, req.get("user-agent") || "");

            const accessToken = signJwt(
                { ...user.toJSON(),session: session._id},
                { expiresIn: ACCESS_TOKEN_TTL } // 15 minutes
            );
            const refreshToken = signJwt(
                { ...user.toJSON(),session: session._id},
                { expiresIn: REFRESH_TOKEN_TTL } // 1 year
            );
            res.setHeader("x-access-token", accessToken);
            res.cookie("accessToken", accessToken, accessTokenCookieOptions);
            res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
            return res.redirect(ORIGIN);
        }
        else{
            log.error('User not found');
            throw new Error('User not found');
        }
    }catch(error) {
        log.error(error, "Failed to authorize google user");
    }
}

