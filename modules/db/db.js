const config = require('../../config');

module.exports = (() => {
  if (global.db) {
    return global.db;
  }

  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
  const connection = mongoose.connect(config.db_url);

  var notes = new Schema({
    id: Number,
    content: Object,
    date: String
  });

  var users = new Schema({
    id: Number
  });

  global.db = {
    mongoose: mongoose,
    notes: mongoose.model('notes', notes),
    users: mongoose.model('users', users)
  }
})();
