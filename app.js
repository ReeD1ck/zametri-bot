var urlDb = "mongodb://localhost:27017/notes";

var TelegramBot = require("node-telegram-bot-api");
var MongoClient = require('mongodb').MongoClient;
var assert = require("assert");
var config = require("./config");

var token = "TOKEN_BOT";

var bot = new TelegramBot(token, { polling: true });

console.log("Бот запущен...\n");

bot.on("message", msg => {
  // Мониторинг сообщений
  console.log(`Пользователь ${msg.from.first_name} ${msg.from.last_name} (@${msg.from.username}) написал «${msg.text}»`);

  switch (msg.text) {
    case "/start":
      var settings = {
        parse_mode: "markdown",
        reply_markup: JSON.stringify({
          keyboard: [
            [config.enter],
            [config.out]
          ]
        })
      };

      var userFirstName = msg.from.first_name || "";
      var userLastName = msg.from.last_name || "";
      var userUserName = msg.from.username;

      bot.sendMessage(msg.from.id, "*Здравствуйте, " + userFirstName + " " + userLastName + "!*\n\n"
        + "С помощью этого вы можете делать заметки.", settings);

      break;

    case config.enter: 
      var settings = {
        parse_mode: "markdown",
        reply_markup: JSON.stringify({
          force_reply: true
        })
      };

      bot.sendMessage(msg.from.id, "Введите текст заметки:", settings)
        .then(send => {
          bot.onReplyToMessage(send.chat.id, send.message_id, message => {
            var settings = {
              parse_mode: "markdown"
            };

            var note = {};
            note[msg.from.id] = {};

            // Определяем тип сообщения

            if (message.text) {
              note[msg.from.id]["text"] = message.text;
            } else if (message.sticker) {
              note[msg.from.id]["sticker"] = message.sticker.file_id;
            } else if (message.photo) {
              note[msg.from.id]["photo"] = message.photo[2].file_id;
            } else if (message.video) {
              note[msg.from.id]["video"] = message.video.file_id;
            } else if (message.voice) {
              note[msg.from.id]["voice"] = message.voice.file_id;
            } else {
              note[msg.from.id]["document"] = message.document.file_id;
            }

            MongoClient.connect(urlDb, (err, db) => {
              assert.equal(null, err);

              console.log("Подключение к базе для ввода информации.");

              var notes = db.collection("notes");

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
                  bot.sendMessage(msg.from.id, "К сожалению, сообщение не было записано.", settings);

                  // console.log(err);
                } else {
                  bot.sendMessage(msg.from.id, "Сообщение успешно записано.", settings);

                  // console.log(result);
                }
              });

              console.log("Записали заметку.");

              db.close();
            });
          });
        });

      break;

    case config.out:
      var getNote = new Promise((resolve, reject) => {
        MongoClient.connect(urlDb, (err, db) => {
          assert.equal(null, err);

          console.log("Подключение к базе для вывода информации.");

          var notes = db.collection("notes");
          var allNotes = [];

          notes.find().toArray((err, results) => {
            for (var userId in results) {
              if (results[userId]) {
                allNotes.push(results[userId][msg.from.id]);
              }
            }

            resolve(allNotes[allNotes.length - 1]);
          });

          setTimeout(() => reject("Ошибка при выводе информации."), 1000);
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

      break;

    default:
      if (msg.reply_to_message) return; // Фиксим, чтобы бот не отвечал на сообщение к onReply

      bot.sendMessage(msg.from.id, "Бот ничего не понял, попробуйте вновь. Вы точно хотите от бота то, что он умеет?");
  }
});