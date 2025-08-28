import { generateStreamToken } from '../config/stream.config.js';

export const getStreamToken = async (req, res) => {
  try {
    // The user ID is available in req.auth.userId because of the Clerk middleware
    const token = generateStreamToken(req.auth().userId);
    res.status(200).json({ token });
  } catch (error) {
    console.log('Error generating Stream token:', error);
    res.status(500).json({
      message: 'Failed to generate Stream token',
    });
  }
};
