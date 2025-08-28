import { Router } from 'express';
import { getStreamToken } from '../controllers/chat.controller.js';

const router = Router();

// This route is used to generate a Stream token for a user
router.get('/token', getStreamToken);

export default router;
