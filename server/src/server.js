import { ENV } from './config/env.config.js';
import app from './App.js';

const PORT = ENV.PORT || 8080;

app.listen(PORT, () => {
  console.info(`✔️ Server is up and running on port: ${PORT}`);
});
