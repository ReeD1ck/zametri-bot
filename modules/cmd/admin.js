const TelegramBot = require('node-telegram-bot-api');
const config = require('../../config');
const mongoose = require('mongoose');
const Notes = require('../db/notes_model');

const bot = new TelegramBot(config.token, { polling: false });

module.exports = (msg) => {
  var settings = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{
          text: 'Содержимое Users',
          callback_data: 'check_bd?users'
        }, {
          text: 'Содержимое Notes',
          callback_data: 'check_bd?notes'
        }], [{
          text: 'Очистить Users',
          callback_data: 'delete_bd?users'
        }, {
          text: 'Очистить Notes',
          callback_data: 'delete_bd?notes'
        }],
        [{
          text: 'Активные пользователи',
          callback_data: 'active_users'
        }]
      ]
    })
  };

  bot.sendMessage(msg.from.id, 'Что нужно сделать?', settings);
};