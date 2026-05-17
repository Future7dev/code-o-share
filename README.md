# Code-o-Share

A real-time collaborative code editor built using the MERN stack with live code synchronization, chat, authentication, MongoDB persistence, and Docker-powered code execution using Judge0.

---

# Features

* Real-time collaborative code editor
* Live chat system using Socket.IO
* User signup and login authentication
* Save and retrieve code from MongoDB
* Multi-language code execution
* Self-hosted Judge0 compiler using Docker
* Room-based collaboration
* Copy room ID feature
* Real-time cursor synchronization
* Modern Monaco editor integration
* Responsive IDE-style UI

---
#Live link
https://code-o-share.vercel.app/
# Tech Stack

## Frontend

* React
* Vite
* Socket.IO Client
* Monaco Editor
* Axios
* React Router DOM
* React Hot Toast

## Backend

* Node.js
* Express.js
* Socket.IO
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

## Code Execution

* Judge0
* Docker
* PostgreSQL
* Redis

---

# Project Structure

```bash
code-o-share/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
└── judge0/
```

---

# Installation

## 1. Clone Repository

```bash
git clone <your-repository-url>
cd code-o-share
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

---

# Environment Variables

Create a `.env` file inside backend:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

# MongoDB Setup

Use either:

* MongoDB Atlas
* Local MongoDB server

Example:

```env
MONGO_URI=mongodb://127.0.0.1:27017/codeoshare
```

---

# Judge0 Setup Using Docker

## Install Docker Desktop

Download Docker Desktop:

[https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

Enable:

* WSL2 backend
* Linux containers

---

## Clone Judge0

```bash
git clone https://github.com/judge0/judge0.git
cd judge0
```

---

## Start Judge0

```bash
docker compose up -d db redis
```

Wait 20-30 seconds.

Then:

```bash
docker compose up -d
```

---

# Verify Judge0

Open:

```txt
http://localhost:2358/docs
```

---

# Judge0 Language IDs

| Language   | ID |
| ---------- | -- |
| JavaScript | 63 |
| Python     | 71 |
| Java       | 62 |
| C++        | 54 |

---

# Real-Time Features

## Socket Events

### Join Room

```js
socket.emit('join-room', {
  roomId,
  username
});
```

### Code Change

```js
socket.emit('code-change', {
  roomId,
  code
});
```

### Chat Message

```js
socket.emit('send-message', {
  roomId,
  username,
  message
});
```

### Cursor Position

```js
socket.emit('cursor-change', {
  roomId,
  cursor
});
```

---

# Authentication

Authentication includes:

* Signup
* Login
* JWT token generation
* Password hashing using bcrypt

---

# Save and Retrieve Code

Code is stored in MongoDB using:

* roomId
* code
* language
* timestamps

Users can:

* Save code
* Load previous rooms
* Delete saved rooms

---

# Running the Full Application

## Start Frontend

```bash
cd frontend
npm run dev
```

## Start Backend

```bash
cd backend
npm run dev
```

## Start Judge0

```bash
cd judge0
docker compose up -d
```

---

# Future Improvements

* AI code assistant
* Voice chat
* Collaborative terminal
* File explorer
* Multiple tabs
* Theme switching
* Live user presence
* Competitive coding mode
* Video calling
* Code playback history

---

# Troubleshooting

## Docker Issues

Restart Docker:

```bash
docker compose down -v
docker compose up -d
```

---

## Socket Connection Issues

Make sure:

* frontend runs on port 5173
* backend runs on port 5000
* CORS is enabled

---

## MongoDB Connection Error

Verify:

* MongoDB service running
* correct MONGO_URI

---

# Screenshots

Add screenshots of:

* editor
* chat
* live collaboration
* saved rooms
* code execution

---

# License

MIT License

---

# Author

Developed by Priyam Koley.
