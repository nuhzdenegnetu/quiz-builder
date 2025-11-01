import { useEffect, useState } from 'react';
import Link from 'next/link';
import { quizApi } from '@/services/quiz.service';
import { FaTrash } from 'react-icons/fa';

import { Quiz as BaseQuiz } from '@/types/quiz';
import { AxiosError } from 'axios';

interface QuizWithCount extends BaseQuiz {
  _count: {
    questions: number;
  };
}

const QuizList = () => {
  const [quizzes, setQuizzes] = useState<QuizWithCount[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizzes = async () => {
    try {
      const data = await quizApi.getAll();
      setQuizzes(data as QuizWithCount[]);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Failed to fetch quizzes:', error.response?.data);
        setError('Failed to fetch quizzes. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await quizApi.delete(id);
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
        } else {
          setError('Failed to delete quiz. Please try again.');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Quizzes</h1>
          <Link
            href="/create"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create New Quiz
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <Link
                  href={`/quizzes/${quiz.id}`}
                  className="text-xl font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  {quiz.title}
                </Link>
                <button
                  onClick={() => handleDelete(quiz.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
              <p className="mt-2 text-gray-600">
                {quiz._count.questions} {quiz._count.questions === 1 ? 'question' : 'questions'}
              </p>
            </div>
          ))}
        </div>

        {quizzes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No quizzes available. Create one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;
