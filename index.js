const mineflayer = require('mineflayer');
const { mineflayer: mineflayerViewer } = require('prismarine-viewer');
require('./server'); // Adiciona o servidor para manter o bot ativo

const bot = mineflayer.createBot({
  host: 'kamaga321.aternos.me',
  port: 11324,
  username: 'nome_do_bot',
  version: '1.16.4'
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

