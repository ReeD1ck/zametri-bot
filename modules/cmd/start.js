module.exports = (bot, config, db, assert) => {
  var module = {};

  module.cmd = (msg) => {
    var settings = {
      parse_mode: 'markdown',
      reply_markup: JSON.stringify({
        keyboard: [
          [config.enter],
          [config.out]
        ]
      })
    };

    var userFirstName = msg.from.first_name || '';
    var userLastName = msg.from.last_name || '';
    var userUserName = msg.from.username;

    bot.sendMessage(msg.from.id, `*Здравствуйте, ${userFirstName} ${userLastName}!*\n\n С помощью этого вы можете делать заметки.`, settings);
  };

  return module;
};