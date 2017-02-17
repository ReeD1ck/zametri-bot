const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const database = require('./modules/db/db');

const start = require('./modules/cmd/start');
const get = require('./modules/cmd/get');
const out = require('./modules/cmd/out');
const admin = require('./modules/cmd/admin');
const adminKeyboard = require('./modules/cmd/adminKeyboard');
const write = require('./modules/cmd/write');

const bot = new TelegramBot(config.token, { polling: true });

bot.on('message', msg => {
  // Мониторинг сообщений
  console.log(`Пользователь ${msg.from.first_name} ${msg.from.last_name} (@${msg.from.username}) написал «${msg.text}»`);

  if (msg.text == '/start') {
    start(msg);
  } else if (msg.text == '/get') {
    get(msg);
  } else if (msg.text == '/admin' && msg.from.id == 91990226) {
    admin(msg);
  } else {
    write(msg);
  }
});

bot.on('callback_query', msg => {
  if (msg.data.match('get_note')) {
    var id = msg.data.split('?')[1];

    out(msg, id);
  } else {
    adminKeyboard(msg);
  }
});