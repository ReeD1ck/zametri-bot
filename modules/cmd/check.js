var { Extra, Markup } = require('telegraf');
var config = require('../../config');
var database = require('../db/db');

module.exports = ctx => {
  var argument = ctx.callbackQuery.data.split('?')[1];
  var collection = (argument == 'users') ? db.users : db.notes;

  collection.find({})
    .then(results => console.log(results))
    .catch(error => ctx.reply(error.toString()));
};
