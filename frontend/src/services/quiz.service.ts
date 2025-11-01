import axios, { AxiosError } from 'axios';
import { Quiz } from '@/types/quiz';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const quizApi = {
  create: async (quizData: Quiz) => {
    try {
      const response = await api.post<Quiz>('/quizzes', quizData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Failed to create quiz:', error.response?.data);
      }
      throw error;
    }
  },

  getAll: async () => {
    try {
      const response = await api.get<Quiz[]>('/quizzes');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Failed to fetch quizzes:', error.response?.data);
      }
      throw error;
    }
  },

  getById: async (id: number) => {
    try {
      const response = await api.get<Quiz>(`/quizzes/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          console.warn(`Quiz with id ${id} not found`);
        }
      }
      throw error;
    }
  },

  delete: async (id: number) => {
    try {
      await api.delete(`/quizzes/${id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          console.warn(`Quiz with id ${id} not found`);
        } else {
          console.error('Failed to delete quiz:', error.response?.data);
        }
      }
      throw error;
    }
  },
};
