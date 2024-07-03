// routes/routes.ts
import express from "express";
import { googleOauthHandler } from "./controllers/sessionsController";
import requireUser from "./middleware/requireUser";
import { getCurrentUser } from "./controllers/userContoller";
import { fetchAllChat } from "./controllers/chatControllers";
import { createCommunity } from "./controllers/communityController";

const router = express.Router();

// Define routes

router.get("/sessions/oauth/google", googleOauthHandler);
router.get("/fetchDetails", requireUser, getCurrentUser);
router.get("/fetchAllChat", requireUser,fetchAllChat);
router.get("/createCommunity",requireUser,createCommunity);

export default router;
