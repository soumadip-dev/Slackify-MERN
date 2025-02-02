import { Router } from 'express';
import { getStreamToken } from '../controllers/chat.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

// This route is used to generate a Stream token for a user
router.get('/token', protectRoute, getStreamToken);

export default router;
