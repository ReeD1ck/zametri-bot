var { Extra,  Markup } = require('telegraf');
var config = require('../../config');
var database = require('../db/db');

module.exports = ctx => {
  var data = ctx.callbackQuery.data;
  var id = data.split('?')[1];

  db.notes.find({ _id: id }).then(results => {
    var item = results[0];
    var settings = Extra
      .HTML()
      .markup(m =>
        m.inlineKeyboard([
          m.callbackButton('Удалить заметку', `delete_note?${id}`),
          m.callbackButton('« Вернуться назад', 'get_notes')
        ], { columns: 1 } ));

    if (item.content.type == 'text') {
      ctx.editMessageText(`<b>Заметка от ${item.date}</b>\n\n${item.content.inner}`, settings);
    } else if (item.content.type == 'sticker') {
      ctx.replyWithSticker(item.content.inner, settings);
    } else if (item.content.type == 'photo') {
      ctx.replyWithPhoto(item.content.inner, { caption: item.content.caption, reply_markup: JSON.stringify({
        inline_keyboard: [[{
          text: 'Удалить заметку',
          callback_data: `delete_note?${id}`
        }], [{
          text: '« Вернуться назад',
          callback_data: `get_notes`
        }]]
      })});
    } else if (item.content.type == 'video') {
      ctx.replyWithVideo(item.content.inner, settings);
    } else if (item.content.type == 'voice') {
      ctx.replyWithVoice(item.content.inner, settings);
    } else {
      ctx.replyWithDocument(item.content.inner, settings);
    }
  }).catch(e => {
    console.log(e)

    ctx.reply(`*Произошла ошибка:*\n\n ${e.toString()}`, Extra.markdown());
  })
};
