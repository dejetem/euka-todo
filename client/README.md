
# Todo Management Application

A modern Todo management application built with Next.js 13, Material-UI, and TypeScript.

## Directory Structure

The project follows Domain-Driven Design (DDD) principles with the following structure:

- Next.js 13 app directory (pages and routing)
- Reusable React components
- Authentication-related components
- Shared/common components
- Todo-specific components
- React Context for state management
- Domain models and business logic
- Authentication domain
- Todo domain
- External services and technical concerns
- API client implementations
- HTTP client configuration
- Utility functions


## Features
- User authentication (sign up/sign in)
- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- Set due dates for todos
- Pagination support
- Protected routes
- Responsive design
- Type-safe implementation


## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Docker Support
To run the application using Docker:
Then run the following command:
- `docker-compose up --build`

## Technology Stack
- Next.js 13
- Material-UI
- TypeScript
- Axios
- React Context
- Docker

## Development Principles
- Domain-Driven Design (DDD)
- Clean Architecture
- Reusable Components
- Type Safety
- Responsive Design














