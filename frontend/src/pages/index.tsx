import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Quiz Builder</h1>
          <p className="mt-3 text-xl text-gray-500">Create and manage your quizzes</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/create"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Quiz
            </Link>
            <Link
              href="/quizzes"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
            >
              View Quizzes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
