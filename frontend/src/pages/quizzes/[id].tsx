import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { quizApi } from '@/services/quiz.service';

type Question = {
  id: number;
  type: 'boolean' | 'input' | 'checkbox';
  question: string;
  options?: string[];
  answers: string[];
  order: number;
};

type Quiz = {
  id: number;
  title: string;
  questions: Question[];
};

const QuizDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    if (id) {
      const fetchQuiz = async () => {
        try {
          const data = await quizApi.getById(Number(id));
          setQuiz(data);
        } catch (error) {
          console.error('Failed to fetch quiz:', error);
          router.push('/quizzes');
        }
      };

      fetchQuiz();
    }
  }, [id, router]);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{quiz.title}</h1>
          <Link
            href="/quizzes"
            className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
          >
            Back to Quizzes
          </Link>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">
                Question {index + 1}: {question.question}
              </h3>

              <div className="ml-4">
                <p className="text-gray-600 mb-2">Type: {question.type}</p>

                {question.type === 'checkbox' && question.options && (
                  <div className="mb-4">
                    <p className="font-medium mb-2">Options:</p>
                    <ul className="list-disc list-inside pl-4">
                      {question.options.map((option, i) => (
                        <li key={i} className="text-gray-700">
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <p className="font-medium mb-2">Correct Answer(s):</p>
                  <ul className="list-disc list-inside pl-4">
                    {question.answers.map((answer, i) => (
                      <li key={i} className="text-gray-700">
                        {answer}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizDetails;
