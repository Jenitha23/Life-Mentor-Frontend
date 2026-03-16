# Life Mentor Frontend

Production-ready frontend for the Life Mentor platform, focused on personal wellbeing, goal execution, and reflective daily habits.

[Live Demo](https://jenitha23.github.io/Life-Mentor-Frontend)

## Table of Contents

- [Overview](#overview)
- [Key Capabilities](#key-capabilities)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Routing](#routing)
- [Deployment](#deployment)
- [Quality and Standards](#quality-and-standards)
- [Contributing](#contributing)
- [License](#license)

## Overview

Life Mentor Frontend is a single-page React application that provides secure user access, guided wellbeing workflows, and integration with backend APIs for personalized experiences.

The app is optimized for:

- Clear onboarding and authentication flows
- Protected user experiences with route guards
- Modular feature domains for maintainability
- Smooth UX via loading states, toasts, and responsive layouts

## Key Capabilities

- User authentication: register, login, forgot password, reset password
- Protected dashboard and feature routes
- AI mentor chat workflow
- Daily check-ins with history tracking
- Goal creation and progress tracking
- Lifestyle assessment creation and review
- Profile management and account actions
- Wellbeing-focused interface with reusable layout components

## Technology Stack

- Framework: React 18
- Build tool: Vite 5
- Routing: React Router v6
- HTTP client: Axios
- Notifications: React Toastify
- Animation: Framer Motion
- Styling: Tailwind CSS + scoped CSS files
- Linting: ESLint

## Architecture

Project structure follows a feature/domain-oriented layout:

```text
src/
  components/                # Reusable UI and feature-level components
    auth/
    AIChat/
    DailyCheckin/
    Goals/
    LifestyleAssessment/
    common/
    layout/
  contexts/
    AuthContext.jsx          # Global auth state and auth actions
  pages/                     # Route-level screens
  services/                  # API modules per domain
  utils/                     # Validation and formatting helpers
```

Key design patterns:

- `AuthContext` centralizes authentication state and user session behavior
- `PrivateRoute` protects authenticated routes
- `services/*` isolates API communication from UI components
- `BrowserRouter` uses `basename={import.meta.env.BASE_URL}` for GitHub Pages compatibility

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Installation

```bash
git clone https://github.com/jenitha23/Life-Mentor-Frontend.git
cd Life-Mentor-Frontend
npm install
```

### Run in Development

```bash
npm run dev
```

Default local URL: `http://localhost:5173`

## Configuration

Current API base URL is defined in [`src/services/api.js`](./src/services/api.js):

```js
const API_BASE_URL = "http://localhost:8080/api";
```

If your backend runs on a different host, update `API_BASE_URL` accordingly.

Recommended next improvement:

- Move API base URL to environment variables (`.env`) for environment-specific deployments.

## Available Scripts

- `npm run dev`: Start Vite development server
- `npm run build`: Build production assets
- `npm run preview`: Preview production build locally
- `npm run lint`: Run static lint checks

## Routing

Public routes:

- `/`
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`

Protected routes:

- `/dashboard`
- `/profile`
- `/ai-chat`
- `/daily-checkin`
- `/goals`
- `/wellbeing`
- `/dashboard/assessment/create`
- `/dashboard/assessment`

## Deployment

The project is set up for static deployment with GitHub Pages and route base support via Vite/React Router basename handling.

- Live site: [https://jenitha23.github.io/Life-Mentor-Frontend](https://jenitha23.github.io/Life-Mentor-Frontend)

For production deployments, verify:

- API URL points to production backend
- CORS is configured on backend
- Deep-link fallback (404 handling) is available for SPA routes

## Quality and Standards

- Linting via ESLint (`npm run lint`)
- Modular service layer for API maintainability
- Context-driven auth state management
- Clean separation between route pages and reusable components

## Contributing

1. Fork the repository
2. Create a feature branch (`feature/your-feature-name`)
3. Commit changes with clear messages
4. Run lint and build checks
5. Open a pull request
