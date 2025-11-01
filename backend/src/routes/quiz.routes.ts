import { Router } from 'express';
import { createQuiz, getAllQuizzes, getQuizById, deleteQuiz } from '../controllers/quiz.controller';

export const quizRouter = Router();

quizRouter.post('/', createQuiz);
quizRouter.get('/', getAllQuizzes);
quizRouter.get('/:id', getQuizById);
quizRouter.delete('/:id', deleteQuiz);
