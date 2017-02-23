var { Extra, Markup } = require('telegraf');
var config = require('../../config');
var database = require('../db/db');

module.exports = ctx => {
  db.users.find({}).then(results => {
    var message = '*Пользователи:*\n\n';

    results.forEach(item => message += `${item.id}; `);

    ctx.reply(message.substr(0, message.length - 2), Extra.markdown());
  }).catch(error => ctx.reply(error.toString()));
};
