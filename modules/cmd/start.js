var { Extra, Markup } = require('telegraf');
var config = require('../../config');
var database = require('../db/db');

module.exports = ctx => {
  var data = { id: ctx.from.id };
  var user = new db.users(data);

  db.users.find({ id: data.id }).then(results => {
    if (!results[0]) user.save();
  });

  ctx.reply(`*Привет!*\n\nЧтобы записать заметку, просто напишите что-то этому боту, он автоматически сохраняет все сообщения.\n\nПолучить помощь можно по команде /help, а для вывода используйте команду /get.`, Extra.markdown());
};
