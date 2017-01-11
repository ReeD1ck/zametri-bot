module.exports = (bot, config, assert, MongoClient) => {
  var module = {};

  module.cmd = (msg, urlDb) => {
    var settings = {
      parse_mode: 'markdown',
      reply_markup: JSON.stringify({
        force_reply: true
      })
    };

    bot.sendMessage(msg.from.id, 'Введите текст заметки:', settings)
      .then(send => {
        bot.onReplyToMessage(send.chat.id, send.message_id, message => {
          var settings = {
            parse_mode: 'markdown'
          };

          var note = {};
          note[msg.from.id] = {};

          // Определяем тип сообщения

          if (message.text) {
            note[msg.from.id]['text'] = message.text;
          } else if (message.sticker) {
            note[msg.from.id]['sticker'] = message.sticker.file_id;
          } else if (message.photo) {
            note[msg.from.id]['photo'] = message.photo[message.photo.length - 1].file_id;
          } else if (message.video) {
            note[msg.from.id]['video'] = message.video.file_id;
          } else if (message.voice) {
            note[msg.from.id]['voice'] = message.voice.file_id;
          } else {
            note[msg.from.id]['document'] = message.document.file_id;
          }

          MongoClient.connect(urlDb, (err, db) => {
            assert.equal(null, err);

            var notes = db.collection('notes');

            var settings = {
              reply_markup: JSON.stringify({
                keyboard: [
                  [config.enter],
                  [config.out]
                ]
              })
            };

            notes.insert(note, (err, result) => {
              if (err) {
                bot.sendMessage(msg.from.id, 'К сожалению, сообщение не было записано.', settings);

                console.log(err);
              } else {
                bot.sendMessage(msg.from.id, 'Сообщение успешно записано.', settings);
              }
            });

            db.close();
          });
        });
      });
  };

  return module;
};