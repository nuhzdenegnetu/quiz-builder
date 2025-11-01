export type QuestionType = {
  id?: number;
  type: 'boolean' | 'input' | 'checkbox';
  question: string;
  options?: string[];
  answers: string[];
  order?: number;
};

export type Quiz = {
  id: number;
  title: string;
  questions: QuestionType[];
  createdAt?: string;
  updatedAt?: string;
};
