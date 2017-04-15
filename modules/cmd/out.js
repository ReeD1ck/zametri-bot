const { Extra } = require('telegraf')

require('../db/db')

module.exports = (ctx) => {
  const data = ctx.callbackQuery.data
  const id = data.split('?')[1]

  db.notes.find({ _id: id }).then(results => {
    const item = results[0]
    const deleteNoteData = `delete_note?${id}&type=${item.content.type}`
    const settings = Extra
      .HTML()
      .markup(m =>
        m.inlineKeyboard([
          m.callbackButton('Удалить заметку', deleteNoteData),
          m.callbackButton('« Вернуться назад', `get_notes?type=${item.content.type}`)
        ], { columns: 1 }))

    if (item.content.type == 'text') {
      ctx.editMessageText(item.content.inner, settings)
    } else if (item.content.type == 'sticker') {
      ctx.replyWithSticker(item.content.inner, settings)
    } else if (item.content.type == 'photo') {
      ctx.replyWithPhoto(item.content.inner, { caption: item.content.caption,
        reply_markup: JSON.stringify({
          inline_keyboard: [[{
            text: 'Удалить заметку',
            callback_data: deleteNoteData
          }], [{
            text: '« Вернуться назад',
            callback_data: `get_notes`
          }]]
        })})
    } else if (item.content.type == 'video') {
      ctx.replyWithVideo(item.content.inner, settings)
    } else if (item.content.type == 'voice') {
      ctx.replyWithVoice(item.content.inner, settings)
    } else {
      ctx.replyWithDocument(item.content.inner, settings)
    }
  }).catch(console.log)
}
