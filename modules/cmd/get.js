const { Markup } = require('telegraf')

require('../db/db')

const attachmentType = (attachment) => {
  if (attachment === 'sticker') {
    return 'Стикер'
  } else if (attachment === 'photo') {
    return 'Фотография'
  } else if (attachment === 'video') {
    return 'Видео'
  } else if (attachment === 'voice') {
    return 'Голосовое сообщение'
  } else {
    return 'Документ'
  }
}

module.exports = (ctx, edit) => {
  if (edit && ctx.callbackQuery.data.split('?type=')[1] != 'text') edit = false

  const generateKeyboard = new Promise(resolve => {
    db.notes.find({ id: ctx.from.id }).then(body => {
      const inline = []

      body.forEach(item => {
        const data = `get_note?${item._id}`

        if (item.content.type === 'text') {
          const title = item.content.inner.split('\n')[0].length >= 40
            ? `${item.content.inner.split('\n')[0].substr(0, 40)}...`
            : item.content.inner.split('\n')[0]

          inline.push(Markup.callbackButton(title, data))
        } else {
          const caption = item.content.caption
            ? item.content.caption.split('\n')[0].length >= 40 ? `${item.content.caption.split('\n')[0].substr(0, 40)}...` : item.content.caption.split('\n')[0]
            : null

          inline.push(Markup.callbackButton(caption || `${attachmentType(item.content.type)} ${item.date}`, data))
        }
      })

      resolve(inline)
    })
  })

  generateKeyboard.then(inline => {
    if (edit) {
      ctx.editMessageText('Выберите заметку.', Markup.inlineKeyboard(inline, { columns: 1 }).extra())
    } else {
      ctx.reply('Выберите заметку.', Markup.inlineKeyboard(inline, { columns: 1 }).extra())
    }
  })
}
