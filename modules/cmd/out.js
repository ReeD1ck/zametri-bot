const TelegramBot = require('node-telegram-bot-api');
const config = require('../../config');
const database = require('../db/db');

const bot = new TelegramBot(config.token, { polling: true });

module.exports = (msg, id) => {
  db.notes.find({ _id: id }, (err, results) => {
    if (!err && results[0]) {
      console.log(results);

      var item = results[0];
      var button = `delete_note?${id}`;

      var settings = {
        parse_mode: 'HTML',
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
        bot.sendMessage(msg.from.id, `<b>Заметка от ${item.date}</b>\n\n${item.content.inner}`, settings);
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
};
