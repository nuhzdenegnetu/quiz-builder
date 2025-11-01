import { useRouter } from 'next/router';
import Link from 'next/link';

const Navigation = () => {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link
              href="/"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                isActive('/')
                  ? 'text-white border-b-2 border-white'
                  : 'text-indigo-100 hover:text-white hover:border-b-2 hover:border-indigo-100'
              }`}
            >
              Main
            </Link>
            <Link
              href="/create"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                isActive('/create')
                  ? 'text-white border-b-2 border-white'
                  : 'text-indigo-100 hover:text-white hover:border-b-2 hover:border-indigo-100'
              }`}
            >
              Create Quiz
            </Link>
            <Link
              href="/quizzes"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                isActive('/quizzes')
                  ? 'text-white border-b-2 border-white'
                  : 'text-indigo-100 hover:text-white hover:border-b-2 hover:border-indigo-100'
              }`}
            >
              List Quizzes
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
