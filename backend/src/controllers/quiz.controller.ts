import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export const createQuiz = async (req: Request, res: Response) => {
  try {
    logger.info('Creating new quiz', { data: req.body });
    const { title, questions } = req.body;

    const quiz = await prisma.quiz.create({
      data: {
        title,
        questions: {
          create: questions.map((q: any, index: number) => ({
            ...q,
            order: index,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    logger.info('Quiz created successfully', { quizId: quiz.id });
    res.status(201).json(quiz);
  } catch (error) {
    logger.error('Failed to create quiz', { error });
    res.status(500).json({ error: 'Failed to create quiz', details: error });
  }
};

export const getAllQuizzes = async (req: Request, res: Response) => {
  try {
    logger.info('Fetching all quizzes');
    const quizzes = await prisma.quiz.findMany({
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    logger.info('Quizzes fetched successfully', { count: quizzes.length });
    res.json(quizzes);
  } catch (error) {
    logger.error('Failed to fetch quizzes', { error });
    res.status(500).json({ error: 'Failed to fetch quizzes', details: error });
  }
};

export const getQuizById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info('Fetching quiz by id', { id });

    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(id) },
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!quiz) {
      logger.warn('Quiz not found', { id });
      return res.status(404).json({ error: 'Quiz not found' });
    }

    logger.info('Quiz fetched successfully', { quizId: quiz.id });
    res.json(quiz);
  } catch (error) {
    logger.error('Failed to fetch quiz', { error, id: req.params.id });
    res.status(500).json({ error: 'Failed to fetch quiz', details: error });
  }
};

import { Prisma } from '@prisma/client';

export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const quizId = parseInt(id);

    logger.info('Deleting quiz', { id });

    await prisma.quiz.delete({
      where: { id: quizId },
    });

    logger.info('Quiz deleted successfully', { id });
    res.status(204).send();
  } catch (error) {
    logger.error('Failed to delete quiz', { error, id: req.params.id });

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.status(500).json({ error: 'Failed to delete quiz' });
  }
};
