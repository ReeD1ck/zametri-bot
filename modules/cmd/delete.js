require('../db/db')

module.exports = (ctx) => {
  const data = ctx.callbackQuery.data
  const id = data.split('?')[1].split('&')[0]
  const type = data.split('&type=')[1]

  db.notes.find({ _id: id }).remove().then(results => {
    if (type == 'text') {
      ctx.editMessageText('Заметка успешно удалена.')
    } else {
      ctx.reply('Заметка успешно удалена.')
    }
  }).catch(err => {
    if (type == 'text') {
      ctx.editMessageText(err.toString())
    } else {
      ctx.replyWithMarkdown(`*Произошла ошибка:*\n\n ${err.toString()}`)
    }
  })
}
