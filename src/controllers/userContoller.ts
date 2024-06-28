import { Request, Response } from "express";

export async function getCurrentUser(req: Request, res: Response) {
    console.log('Getting Called');
    return res.send(res.locals.user);
}
