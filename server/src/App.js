import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* Root Route
app.get('/', (req, res) => {
  res.send('Hello from SLACKLY backend!');
});

export default app;
