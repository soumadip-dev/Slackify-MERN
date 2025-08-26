import { ENV } from './config/env.config.js';
import app from './App.js';
import { connectDb } from './config/db.config.js';

const PORT = ENV.PORT || 8080;

//* Function to connect the DB and start the server
const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.info(`✔️ Server is up and running on port: ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
