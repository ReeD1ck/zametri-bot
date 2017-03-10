var Telegraf = require('telegraf');
var { Extra, Markup } = Telegraf;
var config = require('./config');

var start = require('./modules/cmd/start');
var help = require('./modules/cmd/help');
var get = require('./modules/cmd/get');
var out = require('./modules/cmd/out');
var admin = require('./modules/cmd/admin');
var write = require('./modules/cmd/write');
var del = require('./modules/cmd/delete');
var check = require('./modules/cmd/check');
var drop = require('./modules/cmd/drop');
var users = require('./modules/cmd/users');

var app = new Telegraf(config.token);

// app.use(Telegraf.log());

app.command('start', start);
app.command('help', help);
app.command('admin', admin);
app.command('get', ctx => get(ctx, false));

app.action(/get_notes/, ctx => get(ctx, true));
app.action(/get_note/, out);
app.action(/delete_note/, del);
app.action(/check_bd/, check);
app.action(/delete_bd/, drop);
app.action(/active_users/, users);

app.on('message', write);

app.startPolling();
