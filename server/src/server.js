import express from 'express';
import cors from 'cors';

const app = express();

const PORT = 8080;

//* Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//* Root Route
app.get('/', (req, res) => {
  res.send('Hello from SLACKLY backend!');
});

app.listen(PORT, () => {
  console.info(`✔️ Server is up and running on port: ${PORT}`);
});
