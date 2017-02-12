const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const mongoose = require('mongoose');
const Users = require('./modules/db/users_model');
const Notes = require('./modules/db/notes_model');

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
      callback(item.id);
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
  } else if (titles.indexOf(msg.text) != -1) {
    isNoteReal(info, msg.text, (id) => {
      out(msg, id);
    });
  } else {
    write(msg);
  }
});

bot.on('callback_query', msg => {
  adminKeyboard(msg);
});