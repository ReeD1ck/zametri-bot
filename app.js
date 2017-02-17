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

global.titles = [];
global.info = [];

const isNoteReal = (arr, cond, callback) => {
  arr.forEach(item => {
    if (item.text == cond) {
      console.log(item);

      callback(item.id);

      return item.text != cond;
    }
  });
};

bot.on('message', msg => {
  // Мониторинг сообщений
  console.log(`Пользователь ${msg.from.first_name} ${msg.from.last_name} (@${msg.from.username}) написал «${msg.text}»`);

  if (msg.text == '/start') {
    start(msg);
  } else if (msg.text == '/get') {
    get(msg);
  } else if (msg.text == '/admin' && msg.from.id == 91990226) {
    admin(msg);
  } else if (msg.text.split('note_id:')) {
    var id = msg.text.split('note_id:')[1].substr(0, msg.text.split('note_id:')[1].length - 1);

    console.log(id);

    db.notes.find({ _id: id }, (err, results) => {
      if (!err && results[0]) {
        console.log(results);

        out(msg, results[0]);
      }
    });

  } else {
    write(msg);
  }
});

bot.on('callback_query', msg => {
  adminKeyboard(msg);
});