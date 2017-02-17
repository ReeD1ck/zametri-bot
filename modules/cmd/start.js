const TelegramBot = require('node-telegram-bot-api');
const config = require('../../config');
const database = require('../db/db');

const bot = new TelegramBot(config.token, { polling: false });

module.exports = (msg) => {
  var data = { id: msg.from.id };

  db.users.find({ id: data.id }, (err, results) => {
    if (!results[0]) {
      var user = new db.users(data);

      user.save();
    }
  });

  var settings = {
    parse_mode: 'markdown'
  };

  bot.sendMessage(msg.from.id, `*Привет!*\n\nЧтобы записать заметку, просто напишите что-то этому боту, он автоматически сохраняет все сообщения.\n\nДля выводы используйте команду /get.`, settings);
};
