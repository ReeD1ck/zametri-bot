var { Extra, Markup } = require('telegraf');
var config = require('../../config');
var database = require('../db/db');

module.exports = ctx => {
  var argument = ctx.callbackQuery.data.split('?')[1];
  var collection = (argument == 'users') ? db.users : db.notes;

  collection.drop()
    .then(results => ctx.reply(results.toString()))
    .catch(error => ctx.reply(error.toString()));
};
