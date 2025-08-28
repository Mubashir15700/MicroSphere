# 🧩 Node.js Microservices Architecture (TypeScript + Docker)

This project demonstrates a complete **Node.js microservices** architecture using **TypeScript**, **Docker**, **MongoDB**, and **RabbitMQ**. It follows clean service boundaries with **Auth**, **User**, **Task**, **Notification**, and an **API Gateway**. The services communicate via REST and asynchronous messaging using RabbitMQ.

---

## 🧠 Architecture Overview

- **API Gateway** - Entry point for all requests, handles routing and JWT auth.
- **Auth Service** - Manages registration and login, returns JWT.
- **User Service** - Manages user data in MongoDB.
- **Task Service** - Manages tasks and sends messages to RabbitMQ.
- **Notification Service** - Listens to messages from RabbitMQ and logs them.
- **MongoDB** - Stores user and task data.
- **RabbitMQ** - Message broker for async communication.

---

## 📦 Tech Stack

- **Node.js** with **Express**
- **TypeScript**
- **MongoDB**
- **RabbitMQ**
- **JWT Authentication**
- **Docker & Docker Compose**
- **http-proxy-middleware** for API Gateway
- **ts-node-dev** for dev mode hot-reload

---

## 📁 Project Structure

├── api-gateway/
├── auth-service/
├── user-service/
├── task-service/
├── notification-service/
├── docker-compose.yml
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

docker-compose up --build

This will:

- Build each service
- Start MongoDB and RabbitMQ
- Run each microservice with hot-reload enabled
