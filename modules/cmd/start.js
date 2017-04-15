require('../db/db')

module.exports = (ctx) => {
  db.users.findOne({ id: ctx.from.id }).then(body => {
    if (!body) db.users({ id: ctx.from.id }).save()
  })

  ctx.replyWithMarkdown(`*Привет!*\n\nЧтобы записать заметку, просто напишите что-то этому боту, он автоматически сохраняет все сообщения.\n\nПолучить помощь можно по команде /help, а для вывода используйте команду /get.`)
}
