require('../db/db')

module.exports = (ctx) => {
  const collection = (ctx.callbackQuery.data.split('?')[1] === 'users') ? db.users : db.notes

  collection.find({})
    .then(console.log)
    .catch(error => ctx.reply(error.toString()))
}
