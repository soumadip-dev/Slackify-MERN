import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
import { inngest, functions } from './config/inngest.config.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());
app.use('/api/inngest', serve({ client: inngest, functions }));

//* Root Route
app.get('/', (req, res) => {
  res.send('Hello from SLACKLY backend!');
});

export default app;
