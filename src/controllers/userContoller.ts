import { Request, Response } from "express";

export async function getCurrentUser(req: Request, res: Response) {
  return res.send(res.locals.user);
}
