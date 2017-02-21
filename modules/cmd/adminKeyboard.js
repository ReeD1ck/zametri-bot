// dev...

// const TelegramBot = require('node-telegram-bot-api');
// const config = require('../../config');
// const database = require('../db/db');
//
// const bot = new TelegramBot(config.token, { polling: false });
//
// module.exports = (msg) => {
//   if (msg.data.match('check_bd')) {
//     var collection = msg.data.split('?')[1];
//
//     if (collection == 'users') {
//       collection = db.users;
//     } else {
//       collection = db.notes;
//     }
//
//     collection.find({}, (err, results) => {
//       if (!err && results[0]) {
//         console.log(results);
//       } else {
//         console.log((err ? err : 'Nothing to see...'));
//       }
//     });
//   } else if (msg.data.match('delete_bd')) {
//     var collection = msg.data.split('?')[1];
//
//     if (collection == 'users') {
//       collection = db.users;
//     } else {
//       collection = db.notes;
//     }
//
//     collection.drop();
//
//     bot.sendMessage(msg.from.id, 'Записи удалены.');
//   } else if (msg.data == 'active_users') {
//     db.users.find({}, (err, results) => {
//       var activeUsers = '';
//
//       Object.keys(results).forEach(key => {
//         activeUsers += `${results[key].id}; `;
//       });
//
//       bot.sendMessage(msg.from.id, `*Active users:*\n\n${activeUsers}`, { parse_mode: 'markdown' });
//     });
//   } else if (msg.data.match('delete_note')) {
//     var note = decodeURIComponent(msg.data.split('?')[1]);
//
//     db.notes.find({ _id: note }).remove(err => {
//       if (!err) {
//         bot.sendMessage(msg.from.id, 'Заметка удалена.');
//       } else {
//         bot.sendMessage(msg.from.id, 'При удалении заметки произошла ошибка.');
//       }
//     });
//   }
// };
