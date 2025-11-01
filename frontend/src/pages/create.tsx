import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/router';
import { quizApi } from '@/services/quiz.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { Quiz, QuestionType } from '@/types/quiz';
import { AxiosError } from 'axios';

const questionSchema = z.object({
  type: z.enum(['boolean', 'input', 'checkbox']),
  question: z.string().min(1, 'Question is required'),
  options: z.array(z.string()).optional(),
  answers: z.array(z.string()),
  order: z.number().optional(),
});

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
  id: z.number().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const CreateQuiz = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      questions: [
        {
          type: 'input' as const,
          question: '',
          answers: [] as string[],
          options: [] as string[],
          order: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      setError(null);
      const formattedData: Quiz = {
        id: data.id || 0, // временный id для создания
        title: data.title,
        questions: data.questions.map((q, index) => ({
          id: 0, // временный id для создания
          type: q.type,
          question: q.question,
          order: index,
          options: q.type === 'checkbox' ? q.options || [] : [],
          answers:
            q.type === 'boolean'
              ? [q.answers[0]]
              : q.type === 'checkbox'
              ? q.answers
              : [q.answers[0]],
        })),
      };

      await quizApi.create(formattedData);
      await router.push('/quizzes');
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Failed to create quiz. Please try again.');
      } else {
        setError('Failed to create quiz. Please try again.');
      }
      console.error('Failed to create quiz:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Create New Quiz</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-6 rounded-lg shadow"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">Quiz Title</label>
            <input
              type="text"
              {...register('title')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-md bg-gray-50">
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg font-medium">Question {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Question Type</label>
                    <select
                      {...register(`questions.${index}.type`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      onChange={(e) => {
                        const value = e.target.value;
                        setValue(
                          `questions.${index}.type`,
                          value as 'boolean' | 'input' | 'checkbox'
                        );
                        setValue(`questions.${index}.answers`, []);
                        setValue(
                          `questions.${index}.options`,
                          value === 'checkbox' ? ([] as string[]) : undefined
                        );
                      }}
                    >
                      <option value="boolean">Yes/No</option>
                      <option value="input">Short Answer</option>
                      <option value="checkbox">Multiple Choice</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Question Text</label>
                    <input
                      type="text"
                      {...register(`questions.${index}.question`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.questions?.[index]?.question && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.questions[index]?.question?.message}
                      </p>
                    )}
                  </div>

                  {watch(`questions.${index}.type`) === 'checkbox' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Add Options
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter option"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const input = e.target as HTMLInputElement;
                                const newOption = input.value.trim();
                                if (newOption) {
                                  const currentOptions = watch(`questions.${index}.options`) || [];
                                  setValue(`questions.${index}.options`, [
                                    ...currentOptions,
                                    newOption,
                                  ]);
                                  input.value = '';
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            onClick={(e) => {
                              const input = e.currentTarget
                                .previousElementSibling as HTMLInputElement;
                              const newOption = input.value.trim();
                              if (newOption) {
                                const currentOptions = watch(`questions.${index}.options`) || [];
                                setValue(`questions.${index}.options`, [
                                  ...currentOptions,
                                  newOption,
                                ]);
                                input.value = '';
                              }
                            }}
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Options (select correct answers)
                        </label>
                        <div className="space-y-2">
                          {(watch(`questions.${index}.options`) || []).map(
                            (option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className="flex items-center justify-between p-2 bg-white rounded-md"
                              >
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`option-${index}-${optionIndex}`}
                                    className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                    checked={(watch(`questions.${index}.answers`) || []).includes(
                                      option
                                    )}
                                    onChange={(e) => {
                                      const currentAnswers =
                                        watch(`questions.${index}.answers`) || [];
                                      if (e.target.checked) {
                                        setValue(`questions.${index}.answers`, [
                                          ...currentAnswers,
                                          option,
                                        ]);
                                      } else {
                                        setValue(
                                          `questions.${index}.answers`,
                                          currentAnswers.filter((answer) => answer !== option)
                                        );
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`option-${index}-${optionIndex}`}
                                    className="ml-2"
                                  >
                                    {option}
                                  </label>
                                </div>
                                <button
                                  type="button"
                                  className="text-red-600 hover:text-red-800"
                                  onClick={() => {
                                    const currentOptions =
                                      watch(`questions.${index}.options`) || [];
                                    const currentAnswers =
                                      watch(`questions.${index}.answers`) || [];
                                    setValue(
                                      `questions.${index}.options`,
                                      currentOptions.filter((_, i) => i !== optionIndex)
                                    );
                                    setValue(
                                      `questions.${index}.answers`,
                                      currentAnswers.filter((answer) => answer !== option)
                                    );
                                  }}
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {watch(`questions.${index}.type`) === 'boolean' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correct Answer
                      </label>
                      <div className="space-x-4">
                        <button
                          type="button"
                          onClick={() => {
                            setValue(`questions.${index}.answers`, ['true']);
                          }}
                          className={`px-4 py-2 rounded-md ${
                            (watch(`questions.${index}.answers`) || [])[0] === 'true'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setValue(`questions.${index}.answers`, ['false']);
                          }}
                          className={`px-4 py-2 rounded-md ${
                            (watch(`questions.${index}.answers`) || [])[0] === 'false'
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ) : watch(`questions.${index}.type`) === 'input' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Correct Answer
                      </label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        rows={1}
                        onChange={(e) => {
                          setValue(`questions.${index}.answers`, [e.target.value]);
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              append({
                type: 'input' as const,
                question: '',
                answers: [] as string[],
                options: [] as string[],
                order: fields.length,
              })
            }
            className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <FaPlus className="mr-2" /> Add Question
          </button>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center"
          >
            Create Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
