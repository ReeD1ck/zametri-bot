var {
  Extra,
  Markup
} = require('telegraf');
var config = require('../../config');
var database = require('../db/db');

module.exports = (ctx, edit) => {
  if (edit && ctx.callbackQuery.data.split('?type=')[1] != 'text') {
    edit = false;
  }

  var attachmentType = attachment => {
    if (attachment == 'sticker') {
      return 'Стикер';
    } else if (attachment == 'photo') {
      return 'Фотография';
    } else if (attachment == 'video') {
      return 'Видео';
    } else if (attachment == 'voice') {
      return 'Голосовое сообщение';
    } else {
      return 'Документ';
    }
  };

  var getKeyboard = new Promise((resolve, reject) => {
    db.notes.find({ id: ctx.from.id }).then(results => {
      var keyboard = [];

      results.forEach(item => {
        var buttons = [];
        var button = {};

        if (item.content.type == 'text') {
          button.text = (item.content.inner.split('\n')[0].length >= 40) ? `${item.content.inner.split('\n')[0].substr(0, 40)}...` : item.content.inner.split('\n')[0];
          button.callback_data = `get_note?${item._id}`;
        } else {
          var caption;

          if (item.content.caption) {
            caption = (item.content.caption.split('\n')[0].length >= 40) ? `${item.content.caption.split('\n')[0].substr(0, 40)}...` : item.content.caption.split('\n')[0];
          }

          button.text = caption || `${attachmentType(item.content.type)} ${item.date}`;
          button.callback_data = `get_note?${item._id}`;
        }

        buttons.push(button);
        keyboard.push(buttons);
      });

      resolve(keyboard);
    }).catch(reject);
  });

  getKeyboard.then(keyboard => {
    var settings = {
      reply_markup: JSON.stringify({
        inline_keyboard: keyboard
      })
    };

    if (edit) {
      ctx.editMessageText('Выберите заметку.', settings);
    } else {
      ctx.reply('Выберите заметку.', settings);
    }
  }).catch(error => {
    ctx.reply(`*Произошла ошибка:*\n\n ${error.toString()}`, Extra.markdown());
  });
};
