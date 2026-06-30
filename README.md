# TaskManagerApp

Full-stack task management application built with **React + TypeScript** on the frontend and **ASP.NET Core / C#** on the backend.

This repository is a full-stack product-style project focused on authentication, task workflows, calendar-oriented UI, recurring tasks, API-backed persistence, and testable application structure.

## Why this project matters

This project demonstrates practical full-stack engineering across frontend, backend, database, authentication, automated tests, and release workflow concerns.

## Features

- Task creation, update, deletion, and scheduling flows
- Calendar-oriented task visualization
- Recurring task support
- JWT authentication and refresh-token-oriented backend flows
- Responsive React UI with dark/light theme support
- API-backed persistence with Entity Framework Core and MySQL-compatible data access
- Integration test project for backend behavior
- Frontend test, lint, type-check, and E2E script setup

## Tech stack

### Frontend

- React
- TypeScript
- React Router
- Axios
- Tailwind CSS
- Framer Motion
- Cypress / Jest tooling

### Backend

- ASP.NET Core / C#
- Entity Framework Core
- ASP.NET Identity
- JWT authentication
- MySQL provider via Pomelo Entity Framework Core
- xUnit integration tests

## Repository structure

```text
client-ts/                         React + TypeScript frontend
Api/                               Backend API endpoints/controllers
Models/, Dtos/, ViewModels/        Application data shapes
Services/                          Backend service layer
Data/, Migrations/                 EF Core data access and migrations
TaskManagerApp.IntegrationTests/   Backend integration tests
scripts/                           Release/version/dev workflow helpers
```

## Engineering focus

- Full-stack application architecture
- API-driven frontend/backend integration
- Authentication and identity flows
- Maintainable TypeScript UI structure
- Backend persistence and validation
- Testable backend design
- Developer workflow automation

## Running locally

See `DEVELOPMENT_GUIDE.md` for detailed setup notes.

Typical flow:

```bash
# backend
 dotnet restore
 dotnet run

# frontend
 cd client-ts
 npm install
 npm start
```

## Status

Personal full-stack project used to practice and demonstrate product engineering, frontend/backend integration, authentication, and testable application structure.
