# Binary Quiz Application

## Overview

This is a full-stack binary quiz application built with React/TypeScript frontend and Express.js backend. The application allows users to answer binary questions (yes/no, true/false, agree/disagree) in an interactive quiz format with progress tracking and session management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: In-memory storage implementation with interface for future database integration
- **Session Management**: Custom session handling with unique session IDs

### Database Schema
- **questions**: Stores quiz questions with type, category, and ordering
- **quiz_sessions**: Tracks user quiz sessions with progress
- **quiz_responses**: Records user answers to questions

## Key Components

### Frontend Components
- **QuizHeader**: Main navigation and branding
- **ProgressBar**: Visual progress indicator
- **QuestionCard**: Individual question display with answer options
- **QuestionList**: Overview of all questions and their status
- **ResultsModal**: Quiz completion summary and results export
- **FloatingActions**: Save progress and reset functionality

### Backend Services
- **Storage Interface**: Abstract storage layer for data operations
- **MemStorage**: In-memory implementation for development
- **Route Handlers**: REST API endpoints for questions, sessions, and responses

### UI Components
- **shadcn/ui**: Comprehensive component library with Radix UI primitives
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Theme Support**: CSS variables for consistent theming

## Data Flow

1. **Quiz Initialization**: User starts quiz, creates session with unique ID
2. **Question Navigation**: Sequential question presentation with progress tracking
3. **Answer Submission**: Real-time answer storage with validation
4. **Progress Tracking**: Session updates for completion status
5. **Results Generation**: Summary creation and export functionality

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **drizzle-kit**: Database migration and schema management

## Deployment Strategy

### Development
- Vite development server with HMR
- In-memory storage for rapid prototyping
- Replit integration with runtime error overlay

### Production
- Static frontend build served by Express
- PostgreSQL database with Drizzle migrations
- Environment-based configuration

### Build Process
1. Frontend: Vite builds React app to `dist/public`
2. Backend: esbuild bundles Express server to `dist/index.js`
3. Database: Drizzle handles schema migrations

## Changelog
- July 01, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.
