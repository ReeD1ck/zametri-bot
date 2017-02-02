var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notesSchema = new Schema({
  id: Number,
  content: Object,
  date: String
});

module.exports = mongoose.model('notes', notesSchema);