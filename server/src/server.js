import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
import { inngest, functions } from './config/inngest.config.js';
import { ENV } from './config/env.config.js';
import { connectDb } from './config/db.config.js';
import chatRoutes from './routes/chat.route.js';

const app = express();

//* Middlewares
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

//* Root Route
app.get('/', (req, res) => {
  res.send('Hello from SLACKIFY backend!');
});

//* Routes
app.use('/api/inngest', serve({ client: inngest, functions }));
app.use('/api/chat', chatRoutes);

const PORT = ENV.PORT || 8080;

//* Function to connect the DB and start the server
const startServer = async () => {
  try {
    await connectDb();
    if (ENV.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.info(`✔️ Server is up and running on port: ${PORT}`);
      });
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1); // Exit the process with a failure code
  }
};

startServer();

export default app;
