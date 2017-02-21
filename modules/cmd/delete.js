var { Extra, Markup } = require('telegraf');
var config = require('../../config');
var database = require('../db/db');

module.exports = ctx => {
  var data = ctx.callbackQuery.data;
  var id = data.split('?')[1];

  db.notes.find({ _id: id }).remove().then(results => {
    ctx.reply('Заметка успешно удалена.');
  }).then(e => {
    ctx.reply(`*Произошла ошибка:*\n\n ${e.toString()}`, Extra.markdown());
  });
};
