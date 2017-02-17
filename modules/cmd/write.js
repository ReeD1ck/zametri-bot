const TelegramBot = require('node-telegram-bot-api');
const config = require('../../config');
const database = require('../db/db');

const bot = new TelegramBot(config.token, { polling: false });

module.exports = (msg) => {
  var message = {};

  if (msg.text) {
    message.type = 'text';
    message.inner = msg.text;
  } else if (msg.sticker) {
    message.type = 'sticker';
    message.inner = msg.sticker.file_id;
  } else if (msg.photo) {
    message.type = 'photo';
    message.inner = msg.photo[msg.photo.length - 1].file_id;
  } else if (msg.video) {
    message.type = 'video';
    message.inner = msg.video.file_id;
  } else if (msg.voice) {
    message.type = 'voice';
    message.inner = msg.voice.file_id;
  } else {
    message.type = 'doc';
    message.inner = msg.document.file_id;
  }

  var date = new Date();
  var today = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

  var data = {
    id: msg.from.id,
    content: message,
    date: today
  };

  var note = new db.notes(data);

  note.save((err, results) => {
    if (!err) {
      bot.sendMessage(msg.from.id, 'Заметка успешно записана. Наберите /get, чтобы посмотреть записанные заметки.');
    } else {
      bot.sendMessage(msg.from.id, 'При записи произошла ошибка.');
    }
  });
};
