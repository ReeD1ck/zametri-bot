var { Extra, Markup } = require('telegraf');
var config = require('../../config');
var database = require('../db/db');

module.exports = ctx => {
  var data = ctx.callbackQuery.data;
  var id = data.split('?')[1].split('&')[0];
  var type = data.split('&type=')[1];

  console.log(id, type)

  db.notes.find({ _id: id }).remove().then(results => {
    if (type == 'text') {
      ctx.editMessageText('Заметка успешно удалена.').catch(console.log);
    } else {
      ctx.reply('Заметка успешно удалена.');
    }
  }).then(error => {
    if (type == 'text') {
      ctx.editMessageText(`*Произошла ошибка:*\n\n ${error.toString()}`, Extra.markdown());
    } else {
      ctx.reply(`*Произошла ошибка:*\n\n ${error.toString()}`, Extra.markdown());
    }
  });
};
