# Restaurant Operations System (Project WeAre)

A comprehensive system for restaurant operations, including Daily Reporting, Tips Calculation, Waste Management, and Inventory. Built with **NestJS** (Backend) and **Next.js** (Frontend) in a Turborepo monorepo.

## Features
- **Daily Reporting**: Enter sales, cash, and shifts.
- **Tips Calculation**: Automated logic for distributing tips.
- **Waste Management**: Log wasted items with frozen historical costs.
- **Inventory**: Track stock levels (`Inventaario`).
- **Reporting**: Aggregated views for management (CQRS Read Models).
- **Authentication**: Role-Based Access Control (Mock: Staff/Manager).

## Stack
- **Frontend**: Next.js 16, React, Tailwind CSS, AG Grid, Shadcn/UI.
- **Backend**: NestJS, TypeORM, PostgreSQL, Event Sourcing.
- **Infrastructure**: Docker, Redis.

## Getting Started (Development)

1.  **Prerequisites**: Node.js 18+, Docker (for DB/Redis).
2.  **Start Infrastructure**:
    ```bash
    docker compose up -d
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Backend: [http://localhost:3001](http://localhost:3001)

## Getting Started (Production)

To run the entire stack in production mode using Docker:

1.  **Build and Run**:
    ```bash
    docker compose -f docker-compose.prod.yml up --build -d
    ```
    
2.  **Access the App**:
    - Open [http://localhost:3000](http://localhost:3000)

## Architecture
- **Event Sourcing**: The backend uses an append-only `events` table as the source of truth.
- **CQRS**: Read models (`daily_report_view`) are built asynchronously by `ProjectorService`.
- **Monorepo**: Managed by Turborepo.
