# Project Architecture & Data Flow

This document explains how the various parts of the Better Auth JWT Lab connect to each other, emphasizing the **Dependency Injection (DI)** principles we established in `.cursor/rules/dependency-injection.mdc`.

## Core Philosophy: Dependency Injection (DI)

Instead of modules importing each other directly and creating "hard" dependencies, each layer in this app expects its dependencies to be *provided* (injected) to it, usually via a constructor.

This allows for:
1. **Loose Coupling:** Components don't care *how* a dependency was created, only that it matches a certain shape (Interface/Methods).
2. **Easy Testing:** You can easily pass a "fake" (mock) database or service into a controller to test it in isolation.

---

## The Layers

### 1. The Database Layer (`src/config/database.js`)
This is where the connection to the actual database lives. We initialize a single `PrismaClient` instance and export it.
- **Responsibility:** Talk to the database.

### 2. The Repository Layer (`src/repositories/`)
Repositories act as an abstraction over the database queries. Instead of writing Prisma code directly in your business logic, you wrap it in a repository.
- **Example:** `UserRepository` 
- **Injected Dependency:** Accepts the Prisma instance via its `constructor(prisma)`.
- **Responsibility:** Executing specific CRUD queries (e.g., `findById`).

### 3. The Service Layer (`src/services/`)
This is the heart of your application: the **Business Logic**. It should ideally know nothing about HTTP requests, responses, or specific databases.
- **Example:** `UserService`
- **Injected Dependency:** Accepts the Repository via its `constructor(userRepository)`.
- **Responsibility:** Applying rules, formatting data, or returning errors (e.g., throwing a "User not found" error if the repository returns null).

### 4. The Controller Layer (`src/controllers/`)
Controllers act as the bridge between the HTTP world (Express `req`/`res`) and your application's Service layer.
- **Example:** `UserController`
- **Injected Dependency:** Accepts the Service via its `constructor(userService)`.
- **Responsibility:** Extracting variables from the Request (body, params, headers, or `req.user` attached by middleware), calling the Service, and formatting the Response (status 200, 400, 404, etc.).

### 5. Middleware (`src/middleware/auth.middleware.js`)
Middleware functions run before a request reaches the Controller. 
- **Responsibility:** Checking if a user is authenticated (via Better Auth session), extracting the JWT bearer token, and attaching user details to `req.user` for the Controller to use.

---

## How They Connect (The "Wiring")

The actual connection (Injection) happens at the **Route** level (`src/routes/user.js`), or sometimes in a dedicated DI container file.

Look at how `user.js` wires everything up:

```javascript
import prisma from '../config/database.js'
import { UserRepository } from '../repositories/user.repository.js'
import { UserService } from '../services/user.service.js'
import { UserController } from '../controllers/user.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

// 1. Give the DB to the Repo
const userRepository = new UserRepository(prisma)

// 2. Give the Repo to the Service
const userService = new UserService(userRepository)

// 3. Give the Service to the Controller
const userController = new UserController(userService)

// 4. Attach Controller method to the Route (protected by Middleware)
router.get('/profile', authMiddleware, userController.profileHandler)
```

## The Request Data Flow

Let's trace a practical example: `GET /api/user/profile`

1. **Client (Postman/Browser):** Sends a `GET` request with header `Authorization: Bearer <token>`.
2. **App Entry (`src/app.js`):** The auto-router sees `/api/user` and sends it to `routes/user.js`.
3. **Middleware (`authMiddleware`):** 
   - Intercepts the request.
   - Tells Better Auth to verify the session.
   - If valid, attaches `req.user = session.user`.
   - Calls `next()` to pass control down.
4. **Route -> Controller (`UserController.profileHandler`):**
   - Extracts the ID from `req.user.id`.
   - Calls `this.userService.getProfile(id)`.
5. **Controller -> Service (`UserService.getProfile`):**
   - Applies business rules.
   - Calls `this.userRepository.findById(id)`.
6. **Service -> Repository (`UserRepository.findById`):**
   - Runs `this.prisma.user.findUnique({ where: { id } })`.
   - Returns DB result to Service.
7. **Service -> Controller:** Service returns the user object to the Controller.
8. **Controller -> Client:** Sends `res.status(200).json({ user })`.

---

## Why did we do this?

While Better Auth handles its own endpoints (`/api/auth/*`) magically, the moment you need to build **custom endpoints** that query your own tables (e.g., getting a profile, fetching posts for a user), writing the DB query directly inside the Express Route quickly becomes messy. By writing `.cursor/rules/dependency-injection.mdc` and adhering to this structure, any new developer (or AI) added to this project knows exactly where to put DB queries vs. Business Logic vs. HTTP Responses.
