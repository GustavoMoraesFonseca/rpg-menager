const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

let initiatives = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.emit('init', initiatives);

  socket.on('message', (msg) => {
    console.log('Received message:', msg);

    if (msg.hpCalc) {
      const i = initiatives.findIndex((iniciative) => iniciative.name == msg.name);      
      msg.hp = +msg.hp + +msg.hpCalc;
      if (msg.hp <= 0) {
        initiatives.splice(i, 1);
      } else {
        initiatives[i] = msg;
      }
    } else {
      initiatives.push(msg);
    }

    initiatives.sort((a, b) => b.iniciativeValue - a.iniciativeValue);
    io.emit('update', initiatives);
  });

  socket.on('delete', () => {
    console.log('Deleting iniciatives');
    initiatives = [];
    io.emit('delete', initiatives);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Socket.IO server running on http://localhost:3000');
});
