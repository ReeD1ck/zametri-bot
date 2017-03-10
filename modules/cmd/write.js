var moment = require('moment');
var request = require('request');
var cheerio = require('cheerio');
var config = require('../../config');
var database = require('../db/db');
var { Extra, Markup } = require('telegraf');

module.exports = ctx => {
  var writeNote = note => {
    note.save().then(results => {
      ctx.reply('Заметка успешно записана. Наберите /get, чтобы посмотреть записанные заметки.');
    }).catch(e => {
      ctx.reply(`*Произошла ошибка:*\n\n ${e.toString()}`, Extra.markdown());
    });
  };

  var today = moment().format('ll');
  var note;
  var data = {
    id: ctx.from.id,
    content: {},
    date: today };

  if (ctx.updateSubType == 'text') {
    data.content.type = 'text';

    var getTitlePage = new Promise((resolve, reject) => {
      if (ctx.message.text.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/g)) {
        var url = ctx.message.text.match('http') ? ctx.message.text : `http://${ctx.message.text}`;

        request(url, (error, response, body) => {
          if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            var title = $('title').text();

            resolve([title.replace(/\S*#(?:\[[^\]]+\]|\S+)/g, '').trim(), url]);
          } else {
            resolve(url);
          }
        });
      } else {
        resolve(ctx.message.text.replace(/\S*#(?:\[[^\]]+\]|\S+)/g, '').trim());
      }
    });

    getTitlePage
      .then(response => data.content.inner = typeof response == 'object' ? `${response[0]}\n\n${response[1]}` : response)
      .then(() => writeNote(db.notes(data)))
      .catch(console.log);
  } else if (ctx.updateSubType == 'sticker') {
    data.content.type = 'sticker';
    data.content.inner = ctx.message.sticker.file_id;
  } else if (ctx.updateSubType == 'photo') {
    data.content.type = 'photo';
    data.content.caption = ctx.message.caption;
    data.content.inner = ctx.message.photo[ctx.message.photo.length - 1].file_id;
  } else if (ctx.updateSubType == 'video') {
    data.content.type = 'video';
    data.content.inner = ctx.message.video.file_id;
  } else if (ctx.updateSubType == 'voice') {
    data.content.type = 'voice';
    data.content.inner = ctx.message.voice.file_id;
  } else {
    data.content.type = 'doc';
    data.content.inner = ctx.message.document.file_id;
  }

  if (data.content.type != 'text') {
    writeNote(db.notes(data));
  }
};
