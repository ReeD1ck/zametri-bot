var moment = require('moment');
var { Extra, Markup } = require('telegraf');
var config = require('../../config');
var database = require('../db/db');

module.exports = ctx => {
  var msg = {};

  if (ctx.updateSubType == 'text') {
    msg.type = 'text';
    msg.inner = ctx.message.text;
  } else if (ctx.updateSubType == 'sticker') {
    msg.type = 'sticker';
    msg.inner = ctx.message.sticker.file_id;
  } else if (ctx.updateSubType == 'photo') {
    msg.type = 'photo';
    msg.caption = ctx.message.caption;
    msg.inner = ctx.message.photo[ctx.message.photo.length - 1].file_id;
  } else if (ctx.updateSubType == 'video') {
    msg.type = 'video';
    msg.inner = ctx.message.video.file_id;
  } else if (ctx.updateSubType == 'voice') {
    msg.type = 'voice';
    msg.inner = ctx.message.voice.file_id;
  } else {
    msg.type = 'doc';
    msg.inner = ctx.message.document.file_id;
  }

  var today = moment().format('ll');
  var data = {
    id: ctx.from.id,
    content: msg,
    date: today
  };
  var note = db.notes(data);

  note.save().then(results => {
    ctx.reply('Заметка успешно записана. Наберите /get, чтобы посмотреть записанные заметки.');
  }).catch(e => {
    ctx.reply(`*Произошла ошибка:*\n\n ${e.toString()}`, Extra.markdown());
  });
};
