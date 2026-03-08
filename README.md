# JWT Lab (Better Auth)

This is a Node.js / Express laboratory project designed to demonstrate **Dependency Injection (DI)** and **Authentication/Authorization** using [Better Auth](https://better-auth.com/) and [Prisma](https://www.prisma.io/) with an SQLite database.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables Config**
   Create a `.env` file in the root directory (if not already present), and add the following:
   ```env
   DATABASE_URL="file:./dev.db"
   BETTER_AUTH_SECRET="your-super-secret-key-1234567890" // Change this in production!
   BETTER_AUTH_URL="http://localhost:3000"
   ```

3. **Database Setup (Prisma)**
   Make sure to generate the Prisma Client and migrate the database:
   ```bash
   npx prisma generate
   npx prisma db push
   # OR
   npx prisma migrate dev --name init
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   # OR
   npm start
   ```

## API Routes

- `GET /api` : Server Health Check.
- `GET /api/help` : Lists all available routes and required parameters.
- `POST /api/auth/sign-up` : Better Auth Registration.
- `POST /api/auth/sign-in` : Better Auth Login.
- `GET /api/user/profile` : Protected route fetching User Data (Requires Bearer token).

## Architecture

This project strictly adheres to **Dependency Injection (DI)** principles:
- **`routes/`** : Registers endpoints and wires up controllers.
- **`controllers/`** : Handles Express `req` and `res`, calling services for logic.
- **`services/`** : Contains core business logic.
- **`repositories/`** : Handles direct database (Prisma) operations.
