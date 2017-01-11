module.exports = (bot, config) => {
  var module = {};

  module.cmd = (msg) => {
    bot.sendMessage(msg.from.id, "Выберите, что хотите сделать с помощью клавиатуры, которая отправилась вам командой /start.");
  };

  return module;
};