const TelegramBot = require('node-telegram-bot-api');
const config = require('../../config');
const mongoose = require('mongoose');
const Notes = require('../db/notes_model');

const bot = new TelegramBot(config.token, { polling: false });

module.exports = (msg, id) => {
  mongoose.connect(config.db_url);

  Notes.find({ _id: id }, (err, results) => {
    if (!err && results) {
      var item = results[0];
      var button = `delete_note?${id}`;

      var settings = {
        parse_mode: 'markdown',
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{
              text: 'Удалить заметку',
              callback_data: button
            }]
          ]
        })
      };

      if (item.content.type == 'text') {
        bot.sendMessage(msg.from.id, `*Заметка от ${item.date}*\n\n${item.content.inner}`, settings);
      } else if (item.content.type == 'sticker') {
        bot.sendSticker(msg.from.id, item.content.inner, settings);
      } else if (item.content.type == 'photo') {
        bot.sendPhoto(msg.from.id, item.content.inner, settings);
      } else if (item.content.type == 'video') {
        bot.sendVideo(msg.from.id, item.content.inner, settings);
      } else if (item.content.type == 'voice') {
        bot.sendVoice(msg.from.id, item.content.inner, settings);
      } else {
        bot.sendDocument(msg.from.id, item.content.inner, settings);
      }
    } else {
      console.log(err);
    }
  });

  mongoose.connection.close();
};
