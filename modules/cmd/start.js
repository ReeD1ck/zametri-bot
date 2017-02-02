const TelegramBot = require('node-telegram-bot-api');
const config = require('../../config');
const mongoose = require('mongoose');
const Users = require('../db/users_model');

const bot = new TelegramBot(config.token, { polling: false });

module.exports = (msg) => {
  mongoose.connect(config.db_url);

  var data = { id: msg.from.id };
  var new_user = new Users(data);

  Users.find({ id: data.id }, (err, results) => {
    if (!results[0]) {
      new_user.save();
    }
  });

  mongoose.connection.close();

  var settings = {
    parse_mode: 'markdown'
  };

  bot.sendMessage(msg.from.id, `*Привет!*\n\nЧтобы записать заметку, просто напишите что-то этому боту, он автоматически сохраняет все сообщения.\n\nДля выводы используйте команду /get.`, settings);
};
