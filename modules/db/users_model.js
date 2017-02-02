var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
  id: Number
});

module.exports = mongoose.model('users', usersSchema);