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

app.command('start', ctx => start(ctx));
app.command('help', ctx => help(ctx));
app.command('get', ctx => get(ctx));
app.command('admin', ctx => admin(ctx));

app.action(/get_note/, ctx => out(ctx));
app.action(/delete_note/, ctx => del(ctx));
app.action(/check_bd/, ctx => check(ctx));
app.action(/delete_bd/, ctx => drop(ctx));
app.action(/active_users/, ctx => users(ctx));

app.on('message', ctx => write(ctx));

app.startPolling();
