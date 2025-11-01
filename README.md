# Quiz Builder

A full-stack web application for creating and managing interactive quizzes. This application allows users to create custom quizzes with different types of questions, manage them through a dashboard, and view detailed quiz information.

## Project Overview

The Quiz Builder is designed to provide a user-friendly interface for:
- Creating quizzes with multiple question types
- Managing existing quizzes through a dashboard
- Viewing detailed quiz information
- Real-time quiz management and updates

## Project Structure

```
quiz-builder/
├── backend/              # Express.js server
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── routes/      # API routes
│   │   └── utils/       # Utilities and helpers
│   ├── prisma/          # Database schema and migrations
│   └── .env             # Environment variables
├── frontend/            # Next.js application
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Application pages
│   │   ├── services/    # API services
│   │   └── types/       # TypeScript definitions
│   └── .env.local       # Frontend environment variables
└── README.md           # Project documentation
```

## Tech Stack

### Backend
- **Node.js** with Express.js - Fast and minimalist web framework
- **TypeScript** - Type safety and better developer experience
- **PostgreSQL** - Reliable and robust database
- **Prisma ORM** - Modern database toolkit
- **Winston** - Logging library
- **CORS** - Cross-origin resource sharing

### Frontend
- **Next.js** - React framework for production
- **TypeScript** - Type safety
- **React Hook Form** - Form validation and handling
- **Zod** - Schema validation
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Icons** - Icon components

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL (v12 or later)
- npm or yarn
- Git

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd quiz-builder
```

### 2. Database Setup

1. Start PostgreSQL service
2. Create a new database:
```bash
psql postgres
CREATE DATABASE quiz_builder;
```

### 3. Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp example.env .env
```

4. Update .env file with your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/quiz_builder?schema=public"
PORT=3001
CORS_ORIGIN=http://localhost:3002
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run dev
```

The backend will be available at http://localhost:3001

### 4. Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create and configure .env.local:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:3002

## Features

### Quiz Creation
- Create quizzes with a title and multiple questions
- Three question types supported:
  - **Boolean**: Yes/No questions with button selection
  - **Input**: Short text answer questions
  - **Multiple Choice**: Multiple options with one or more correct answers
- Dynamic addition and removal of questions
- Real-time form validation

### Quiz Management
- View all created quizzes in a dashboard
- Delete quizzes with confirmation
- View detailed quiz information

### User Interface
- Clean and intuitive design
- Responsive layout for all devices
- Interactive form elements
- Real-time feedback and validation
- Smooth navigation between pages

## API Endpoints

- `POST /quizzes` - Create a new quiz
- `GET /quizzes` - Get all quizzes
- `GET /quizzes/:id` - Get quiz by ID
- `DELETE /quizzes/:id` - Delete quiz

## Development

### Available Scripts

Backend:
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```

Frontend:
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```

### Database Management

```bash
npx prisma studio    # Open Prisma Studio
npx prisma migrate dev    # Run migrations
npx prisma generate      # Generate Prisma Client
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
