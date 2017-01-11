var urlDb = 'mongodb://localhost:27017/notes';

var TelegramBot = require('node-telegram-bot-api');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var config = require('./config');

var token = config.token;

var bot = new TelegramBot(token, { polling: true });

var start = require('./modules/cmd/start')(bot, config);
var help = require('./modules/cmd/help')(bot, config);
var enter = require('./modules/cmd/enter')(bot, config, assert, MongoClient);
var out = require('./modules/cmd/out')(bot, config, assert, MongoClient);
var notcommand = require('./modules/cmd/notcommand')(bot, config);

console.log('Бот запущен...\n');

bot.on('message', msg => {
  // Мониторинг сообщений
  console.log(`Пользователь ${msg.from.first_name} ${msg.from.last_name} (@${msg.from.username}) написал «${msg.text}»`);

  if (msg.text == "/start")
    start.cmd(msg);
  else if (msg.text == "/help")
    help.cmd(msg);
  else if (msg.text == config.enter)
    enter.cmd(msg, urlDb);
  else if (msg.text == config.out)
    out.cmd(msg, urlDb);
  else
    notcommand.cmd(msg);
});