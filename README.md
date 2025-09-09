# 🧩 Node.js Microservices Architecture (TypeScript + Docker)

This project demonstrates a complete Node.js microservices architecture using TypeScript, Docker, MongoDB, Redis, and RabbitMQ, along with a Next.js frontend. It follows clean service boundaries with Auth, User, Task, Notification, and an API Gateway. The backend services communicate via REST and asynchronous messaging using RabbitMQ. The frontend is built using Next.js + TypeScript and is currently under development in the /client folder.

---

## 🧠 Architecture Overview

- **API Gateway** – Entry point for all requests, handles routing and JWT authentication.
- **Auth Service** – Manages user registration and login, returns signed JWT tokens.
- **User Service** – Manages user data in MongoDB, with Redis caching implemented in the "Get All Users" API.
- **Task Service** – Manages tasks in MongoDB, and sends messages to RabbitMQ. Redis caching is used in the "Get All Tasks" API.
- **Notification Service** – Subscribes to RabbitMQ and logs notifications or events.
- **MongoDB** – Stores persistent data for users and tasks.
- **Redis** – Caching layer for User and Task services to improve read performance.
- **RabbitMQ** – Message broker for asynchronous, event-driven communication between services.
- **Client** – A Next.js frontend (currently under development).

---

## 📦 Tech Stack

- **Node.js** with **Express**
- **Next.js** (frontend client, under development)
- **TypeScript**
- **MongoDB**
- **Redis** (used in User and Task services)
- **RabbitMQ**
- **JWT Authentication**
- **Docker & Docker Compose**
- **http-proxy-middleware** for API Gateway
- **ts-node-dev** for dev mode hot-reload

---

## 📁 Project Structure

├── api-gateway/ # API Gateway service
├── auth-service/ # Authentication service
├── client/ # Next.js frontend (⚠️ work in progress)
├── user-service/ # User service (uses MongoDB + Redis)
├── notification-service/ # Notification/logging service
├── task-service/ # Task service (uses MongoDB + Redis)
├── docker-compose.yml # Multi-service orchestration
├── .gitignore
└── README.md

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

```docker-compose up --build```

This will:

- Build each service
- Start MongoDB and RabbitMQ
- Run each microservice with hot-reload enabled
