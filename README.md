# Task Manager - Next.js Application

A modern task management application built with Next.js, featuring OAuth authentication, drag-and-drop functionality, and comprehensive testing.

## Features

✅ OAuth Authentication (GitHub & Google)
✅ Email/Password Authentication
✅ Task CRUD Operations
✅ Search & Filter Tasks
✅ Sort by Due Date
✅ Drag & Drop Reordering
✅ Task Status Management
✅ Protected Routes
✅ Responsive Design
✅ Comprehensive Unit Tests (>70% Coverage)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **Drag & Drop:** @hello-pangea/dnd
- **Testing:** Jest & React Testing Library
- **State Management:** React Context API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- GitHub OAuth App credentials
- Google OAuth App credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bablysingh2409/task-manager.git
cd task-manager
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-min-32-characters
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret
```

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)


## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Watch mode:
```bash
npm run test:watch
```

## Test Coverage

Current test coverage: **>70%**

### Tested Components:
- TodoContext (State Management)
- Authentication Service
- Dashboard Page
- Tasks Page
- New Task Page
- Edit Task Page

### Test Cases Include:
- ✅ Positive flows (successful operations)
- ✅ Negative flows (validation errors)
- ✅ Edge cases (empty states, completed tasks)
- ✅ User interactions (search, filter, sort)
- ✅ Authentication flows

## Project Structure
```
task-manager/
├── app/
│   ├── api/auth/[...nextauth]/
│   ├── dashboard/
│   │   ├── tasks/
│   │   │   ├── new/
│   │   │   └── edit/[id]/
│   │   └── page.jsx
│   ├── login/
│   └── page.jsx
├── components/
├── context/
│   └── TodoContext.jsx
├── lib/
│   └── auth.js
├── __tests__/
│   ├── context/
│   ├── lib/
│   └── app/
└── package.json
```

## Bonus Features Implemented

- ✅ Drag & Drop task reordering
- ✅ Comprehensive unit tests (>70% coverage)
- ✅ Modern UI/UX with Tailwind CSS
- ✅ Toast notifications
- ✅ Form validation
- ✅ Responsive design
