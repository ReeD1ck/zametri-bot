const TelegramBot = require('node-telegram-bot-api');
const config = require('../../config');
const database = require('../db/db');

const bot = new TelegramBot(config.token, { polling: false });

module.exports = (msg) => {
  const rightTypeAttach = word => {
    if (word == 'sticker') {
      return 'Стикер';
    } else if (word == 'photo') {
      return 'Фотография';
    } else if (word == 'video') {
      return 'Видео';
    } else if (word == 'voice') {
      return 'Голосовое сообщение';
    } else {
      return 'Документ';
    }
  };

  const getButtons = new Promise((resolve, reject) => {
    db.notes.find({ id: msg.from.id }, (err, results) => {
      if (!err && results.length) {
        var items = results;
        var keyboard = [];

        items.forEach(note => {
          var button = [];

          if (note.content.type == 'text') {
            var buttonText = (note.content.inner.length >= 50) ? `${note.content.inner.substr(0, 50)}... (note_id:${note._id})` : `${note.content.inner} (note_id:${note._id})`;

            button.push(buttonText);
          } else {
            var buttonText = `${rightTypeAttach(note.content.type)} от ${note.date} (id: ${note.content.inner.substr(0, 10)})`;

            button.push(buttonText);
          }

          keyboard.push(button);
          
          titles.push(buttonText);
          info.push({
            text: buttonText,
            id: note._id
          });
        });

        resolve(keyboard);
      } else {
        reject('Заметок пока что нет. Сделайте запись, просто написав мне что-то.');
      }
    });
  });

  getButtons
    .then(keyboard => {
      var settings = {
        parse_mode: 'markdown',
        reply_markup: JSON.stringify({
          one_time_keyboard: true,
          keyboard: keyboard
        })
      };

      bot.sendMessage(msg.from.id, 'Выберите нужную заметку.', settings);
    })
    .catch(err => {
      console.log(err);

      bot.sendMessage(msg.from.id, 'err');
    });
};
