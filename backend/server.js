const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();


// Create HTTP server
const server = http.createServer(app);
const roomCodes = {};


// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});
io.engine.on("connection_error", (err) => {
  console.log(err.req);
  console.log(err.code);
  console.log(err.message);
  console.log(err.context);
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);



// ================= SOCKET.IO =================

const userSocketMap = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId]
      };
    }
  );
}


io.on('connection', (socket) => {

  console.log('User connected:', socket.id);

  
  // JOIN ROOM
  socket.on('join-room', ({ roomId, username }) => {

  userSocketMap[socket.id] = username;

  socket.join(roomId);

  if (roomCodes[roomId]) {

    socket.emit('code-update', {
      code: roomCodes[roomId]
    });

  }

  const clients = getAllConnectedClients(roomId);

  clients.forEach(({ socketId }) => {

    io.to(socketId).emit('joined', {
      clients,
      username,
      socketId: socket.id
    });

  });

});



  // CODE CHANGE


socket.on('code-change', ({ roomId, code }) => {

  roomCodes[roomId] = code;

  socket.in(roomId).emit('code-update', {
    code
  });

});
socket.on('cursor-change', (data) => {
  socket.broadcast.to(data.roomId).emit('cursor-change', data);
});




  // CHAT MESSAGE
  socket.on('send-message', ({ roomId, username, message }) => {

    io.to(roomId).emit('receive-message', {
      username,
      message
    });

  });



  // SYNC CODE
  socket.on('sync-code', ({ socketId, code }) => {

    io.to(socketId).emit('code-update', {
      code
    });

  });



  // DISCONNECT
  socket.on('disconnecting', () => {

    const rooms = [...socket.rooms];

    rooms.forEach((roomId) => {

      socket.in(roomId).emit('disconnected', {
        socketId: socket.id,
        username: userSocketMap[socket.id]
      });

    });

    delete userSocketMap[socket.id];

  });


  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

});


// ================= DATABASE =================

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB Connected');
})
.catch((err) => {
  console.log(err);
});


// ================= START SERVER =================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});