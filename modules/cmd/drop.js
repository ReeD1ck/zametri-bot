require('../db/db')

module.exports = (ctx) => {
  const argument = ctx.callbackQuery.data.split('?')[1]
  const collection = (argument == 'users') ? db.users : db.notes

  collection.drop()
    .then(results => ctx.reply(results.toString()))
    .catch(error => ctx.reply(error.toString()))
}
