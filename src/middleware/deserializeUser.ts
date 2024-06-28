import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwtUtils";
import { reIssueAccessToken } from "../service/sessionService";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "cookies.accessToken") || get(req, "headers.x-access-token");
  console.log('ACCESS TOKEN OBTAINED ',accessToken);
  const refreshToken =
    get(req, "cookies.refreshToken") || get(req, "headers.x-refresh");

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = verifyJwt(accessToken);

  if (decoded) {
    console.log('USER IS NOT EXPIRED ',decoded);
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);

      res.cookie("accessToken", newAccessToken, {
        maxAge: 900000, // 15 mins
        httpOnly: true,
        domain: "localhost",
        path: "/",
        sameSite: "strict",
        secure: false,
      });
    }

    const result = verifyJwt(newAccessToken as string);
    res.locals.user = result.decoded;
    return next();
  }

  return next();
};

export default deserializeUser;