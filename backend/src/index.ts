import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { quizRouter } from './routes/quiz.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Настройка CORS для разработки
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/quizzes', quizRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
