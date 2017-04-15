const { Markup } = require('telegraf')

module.exports = (ctx) => {
  ctx.reply('Что нужно сделать?', Markup
    .inlineKeyboard([
      Markup.callbackButton('Содержимое Users', 'check_bd?users'),
      Markup.callbackButton('Содержимое Notes', 'check_bd?notes'),
      Markup.callbackButton('Очистить Users', 'delete_bd?users'),
      Markup.callbackButton('Очистить Notes', 'delete_bd?notes'),
      Markup.callbackButton('Пользователи', 'active_users')
    ], { columns: 2 })
    .extra())
}
