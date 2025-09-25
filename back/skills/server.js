const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

let skills = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.emit('init', skills);

  socket.on('message', (msg) => {
    console.log('Received message:', msg);

    if (msg.qtdSS != undefined) {
      const i = skills.findIndex((skill) => skill.name == msg.name);
      msg.spellSlots[msg.spellSlotLevel] = +msg.qtdSS;
      skills[i] = msg;
    } else {
      skills.push(msg);
    }

    io.emit('update', skills);
  });

  socket.on('delete', () => {
    console.log('Deleting skills');
    skills = [];
    io.emit('delete', skills);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Socket.IO server running on http://localhost:3001');
});
