# 🧩 MicroSphere – Node.js Microservices Architecture (TypeScript + Docker)

This project demonstrates a complete Node.js microservices architecture using TypeScript, Docker, MongoDB, MySQL, Prisma ORM, Redis, and RabbitMQ, along with a Next.js frontend. It follows clean service boundaries with Auth, User, Task, Notification, and an API Gateway.

Services communicate through REST APIs and asynchronous messaging via RabbitMQ. The frontend, built with Next.js + TypeScript and Zustand for state management, is located in the /client folder and is currently under active development.

---

## 🧠 Architecture Overview

- **API Gateway** – Entry point for all requests, handles routing and JWT authentication.
- **Auth Service** – Manages user registration and login, returns signed JWT tokens.
- **User Service** – Manages user data in MongoDB, with Redis caching implemented in the "Get All Users" API.
- **Task Service** – Manages tasks in MongoDB, and sends messages to RabbitMQ. Redis caching is used in the "Get All Tasks" API.
- **Notification Service** – Subscribes to RabbitMQ and sends notifications to users.
- **Client (Next.js)** – React-based frontend using Zustand for global state management (under development).
- **MongoDB** – Stores persistent data for users and tasks.
- **Prisma ORM with MySQL** – For notifications persistence.
- **Redis** – Caching layer for User and Task services to improve read performance.
- **RabbitMQ** – Message broker for asynchronous, event-driven communication between services.
- **Swagger** – API documentation available for backend services.
- **Husky** – Git hooks for enforcing code quality and pre-commit checks.

---

## 📦 Tech Stack

### 🧰 Backend

- **Node.js** with **Express**
- **TypeScript**
- **MongoDB**
- **MySQL** (for Prisma ORM)
- **Redis** (used in User and Task services)
- **RabbitMQ**
- **JWT Authentication**
- **Docker & Docker Compose**
- **http-proxy-middleware** for API Gateway
- **Swagger** for REST API documentation
- **ts-node-dev** for dev mode hot-reload

### 🖥️ Frontend

- **Next.js** (React + TypeScript)
- **Zustand** – Lightweight state management
- **Axios** – For API requests
- **Tailwind CSS**
- **Swagger UI** – For API documentation

### 🧪 Dev Tooling

- **Husky** – Git hooks for code linting, pre-commit checks, etc.
- **ESLint + Prettier** – Code quality and formatting (assumed, can be mentioned if true)

---

## 📁 Project Structure

```
├── .github/                # 🐙 GitHub Actions/CI workflows
├── .husky/                 # ⚙️ Git hooks for pre-commit, pre-push
├── api-gateway/            # 🚪 Centralized routing & auth handling
├── auth-service/           # 🔐 Handles registration, login, and JWT
├── client/                 # 🖥️ Next.js frontend (Zustand, WIP)
├── notification-service/   # 📣 Notification management (Prisma + RabbitMQ)
├── task-service/           # ✅ Task management (MongoDB + Redis)
├── user-service/           # 👤 User data (MongoDB + Redis)
├── .gitignore              # 🚫 Git ignore rules
├── docker-compose.yml      # 🐳 Docker orchestration
├── package-lock.json       # 🔒 Lock file for dependency versions
├── package.json            # 📦 Project dependencies & Husky configurations
└── README.md               # 📘 Project overview
```

---

## 🚀 Getting Started

### 🔧 Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

### ▶️ Run the Project

1. **Clone the Repository**

```bash
git clone https://github.com/your-username/nodejs-microservices.git
cd nodejs-microservices
```

2. **Start All Services**

`docker-compose up --build`

This will:

- 🔧 Build Docker images for all services
- 🐳 Start MongoDB, Redis, and RabbitMQ containers
- 🚀 Launch all backend services with hot-reload enabled via ts-node-dev
- 🌐 Expose APIs through the API Gateway

---

## 📄 Swagger API Documentation

Each backend service exposes Swagger UI for exploring and testing APIs.

ℹ️ Swagger docs are available once all services are running via docker-compose up.

Service Swagger URL:

- **Auth Service** - http://localhost:3001/api-docs
- **User Service** - http://localhost:3002/api-docs
- **Task Service** - http://localhost:3003/api-docs
- **Notification Service** - http://localhost:3004/api-docs
