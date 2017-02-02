const TelegramBot = require('node-telegram-bot-api');
const config = require('../../config');
const mongoose = require('mongoose');
const Notes = require('../db/notes_model');
const Users = require('../db/users_model');

const bot = new TelegramBot(config.token, { polling: false });

module.exports = (msg) => {
  if (msg.data.match('check_bd')) {
    var collection = msg.data.split('?')[1];

    if (collection == 'users') {
      collection = Users;
    } else {
      collection = Notes;
    }

    mongoose.connect(config.db_url);

    collection.find({}, (err, results) => {
      if (!err && results[0]) {
        console.log(results);
      } else {
        console.log((err ? err : 'Clean'));
      }
    });

    mongoose.connection.close();
  } else if (msg.data.match('delete_bd')) {
    var collection = msg.data.split('?')[1];

    if (collection == 'users') {
      collection = Users;
    } else {
      collection = Notes;
    }

    mongoose.connect(config.db_url);
    collection.collection.drop();
    mongoose.connection.close();

    bot.sendMessage(msg.from.id, 'Записи удалены.');
  } else if (msg.data == 'active_users') {
    mongoose.connect(config.db_url);

    Users.find({}, (err, results) => {
      var activeUsers = '';

      Object.keys(results).forEach(key => {
        activeUsers += `${results[key].id}; `;
      });

      bot.sendMessage(msg.from.id, `*Active users:*\n\n${activeUsers}`, { parse_mode: 'markdown' });
    });

    mongoose.connection.close();
  } else if (msg.data.match('delete_note')) {
    var note = decodeURIComponent(msg.data.split('?')[1]);

    mongoose.connect(config.db_url);

    Notes.find({ _id: note }).remove(err => {
      if (!err) {
        bot.sendMessage(msg.from.id, 'Заметка удалена.');
      } else {
        bot.sendMessage(msg.from.id, 'При удалении заметки произошла ошибка.');
      }
    });

    mongoose.connection.close();
  }
};