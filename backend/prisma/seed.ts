import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sampleQuiz = await prisma.quiz.create({
    data: {
      title: 'Programming Basics Quiz',
      questions: {
        create: [
          {
            type: 'boolean',
            question: 'Is JavaScript a compiled language?',
            answers: ['false'],
            options: [],
            order: 0
          },
          {
            type: 'input',
            question: 'What command is used to initialize a new Git repository?',
            answers: ['git init'],
            options: [],
            order: 1
          },
          {
            type: 'checkbox',
            question: 'Which of these are valid HTTP methods?',
            options: ['GET', 'POST', 'DELETE', 'PATCH', 'MOVE'],
            answers: ['GET', 'POST', 'DELETE', 'PATCH'],
            order: 2
          }
        ]
      }
    }
  });

  console.log('Created sample quiz:', sampleQuiz);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
