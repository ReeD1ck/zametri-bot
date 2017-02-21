var Telegraf = require('telegraf');
var { Extra, Markup } = Telegraf;
var config = require('./config');

var start = require('./modules/cmd/start');
var get = require('./modules/cmd/get');
var out = require('./modules/cmd/out');
var write = require('./modules/cmd/write');
var del = require('./modules/cmd/delete');

var app = new Telegraf(config.token);

app.use(Telegraf.log());

app.command('start', ctx => start(ctx));
app.command('get', ctx => get(ctx));

app.action(/get_note/, ctx => out(ctx));
app.action(/delete_note/, ctx => del(ctx));

app.on('message', ctx => write(ctx));

app.startPolling();
