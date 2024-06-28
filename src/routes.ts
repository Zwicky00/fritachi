// routes/routes.ts
import express from 'express';
import { googleOauthHandler } from './controllers/sessionsController';
import requireUser from './middleware/requireUser';
import { getCurrentUser } from './controllers/userContoller';

const router = express.Router();

// Define routes

router.get('/sessions/oauth/google',googleOauthHandler);
router.get('/fetchDetails',requireUser,getCurrentUser);

export default router;