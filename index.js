const mineflayer = require('mineflayer');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { mineflayer: mineflayerViewer } = require('prismarine-viewer');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const bot = mineflayer.createBot({
  host: 'kamaga321.aternos.me', // Endereço do servidor
  port: 11324,                  // Porta do servidor
  username: 'nome_do_bot',      // Nome do bot
  version: '1.16.4'             // Versão do Minecraft
});

bot.on('spawn', () => {
  console.log('Bot conectado!');
  mineflayerViewer(bot, { port: 3007, firstPerson: true });
  console.log('Viewer disponível em http://localhost:3007');
});

bot.on('chat', (username, message) => {
  if (username === bot.username) return;

  const command = message.split(' ');
  if (command[0] === 'move') {
    const direction = command[1];
    moveBot(direction);
  } else if (command[0] === 'say') {
    const msg = command.slice(1).join(' ');
    bot.chat(msg);
  }
});

function moveBot(direction) {
  switch (direction) {
    case 'forward':
      bot.setControlState('forward', true);
      break;
    case 'back':
      bot.setControlState('back', true);
      break;
    case 'left':
      bot.setControlState('left', true);
      break;
    case 'right':
      bot.setControlState('right', true);
      break;
    case 'stop':
      bot.clearControlStates();
      break;
    default:
      bot.chat('Direção desconhecida. Use: forward, back, left, right, stop.');
  }
}

io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  socket.on('move', (direction) => {
    moveBot(direction);
  });

  socket.on('chat', (message) => {
    bot.chat(message);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

app.use(express.static('public'));

server.listen(3000, () => {
  console.log('Servidor web disponível em http://localhost:3000');
});
