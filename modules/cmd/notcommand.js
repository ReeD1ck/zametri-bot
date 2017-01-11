module.exports = (bot, config) => {
  var module = {};

  module.cmd = (msg) => {
    if (msg.reply_to_message) return; // Фиксим, чтобы бот не отвечал на сообщение к onReply
    
    bot.sendMessage(msg.from.id, 'Бот ничего не понял, попробуйте вновь. Вы точно хотите от бота то, что он умеет?');
  };

  return module;
};
