module.exports = (bot, config, assert, MongoClient) => {
  var module = {};

  module.cmd = (msg, urlDb) => {
    var getNote = new Promise((resolve, reject) => {
      MongoClient.connect(urlDb, (err, db) => {
        assert.equal(null, err);

        var notes = db.collection('notes');
        var record = [];

        notes.find().toArray((err, results) => {
          results.forEach(note => {
            if (note) record.push(note[msg.from.id]);
          });

          resolve(record[record.length - 1]);
        });

        setTimeout(() => reject('Ошибка при выводе информации.'), 1000);
      });
    });

    getNote
      .then(body => {

        // Отправляем заметку в зависимости от ее типа

        if (body.text) {
          bot.sendMessage(msg.from.id, body.text);
        } else if (body.sticker) {
          bot.sendSticker(msg.from.id, body.sticker);
        } else if (body.photo) {
          bot.sendPhoto(msg.from.id, body.photo);
        } else if (body.video) {
          bot.sendVideo(msg.from.id, body.video);
        } else if (body.voice) {
          bot.sendVoice(msg.from.id, body.voice);
        } else if (body.document) {
          bot.sendDocument(msg.from.id, body.document);
        }
      })
      .catch(e => {
        console.log(e);
      })
  };
  
  return module;
};
