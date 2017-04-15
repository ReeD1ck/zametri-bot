require('../db/db')

module.exports = ctx => {
  db.users.find({}).then(results => {
    var message = '*Пользователи:*\n\n'

    results.forEach(item => message += `${item.id}; `)

    ctx.replyWithMarkdown(message.substr(0, message.length - 2))
  }).catch(console.log)
}
