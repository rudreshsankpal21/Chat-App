# 💬 Real-Time Chat Application

A full-stack real-time chat application built with **React**, **Node.js**, **Express**, and **Socket.IO**. It allows users to send and receive messages instantly without reloading the page, providing a seamless real-time communication experience.

---

## 🚀 Features

- 📡 Real-time messaging using **Socket.IO**
- 👤 Unique user identification (Socket ID or usernames)
- 🧠 Typing indicator (optional)
- ✅ Join/leave notifications
- 📱 Responsive design
- 🕓 Timestamped messages
- 🏠 Simple UI with chat rooms (optional)

---

## 🛠️ Tech Stack

### Frontend:

- React
- Socket.IO Client
- CSS / TailwindCSS

### Backend:

- Node.js
- Express.js
- Socket.IO

---

---

## 🧑‍💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/chat-app.git
cd chat-app
```

### 2. Setup Server

```bash
cd server
npm install
node index.js
```

### 3. Setup Client

```bash
cd ../client
npm install
npm start
```

---

## 🌐 How It Works

- The client connects to the backend via WebSocket using Socket.IO.
- When a user sends a message:

  - `socket.emit('sendMessage', data)` sends it to the server.
  - Server broadcasts it using `io.emit('receiveMessage', data)`.
  - All connected clients receive and display the message in real time.

---

```

```
