const Telegraf = require('telegraf')

const config = require('./config')
const start = require('./modules/cmd/start')
const help = require('./modules/cmd/help')
const get = require('./modules/cmd/get')
const out = require('./modules/cmd/out')
const admin = require('./modules/cmd/admin')
const write = require('./modules/cmd/write')
const del = require('./modules/cmd/delete')
const check = require('./modules/cmd/check')
const drop = require('./modules/cmd/drop')
const users = require('./modules/cmd/users')

const app = new Telegraf(config.token)

app.command('start', start)
app.command('help', help)
app.command('admin', admin)
app.command('get', ctx => get(ctx, false))

app.action(/get_notes/, ctx => get(ctx, true))
app.action(/get_note/, out)
app.action(/delete_note/, del)
app.action(/check_bd/, check)
app.action(/delete_bd/, drop)
app.action(/active_users/, users)

app.on('message', write)

app.startPolling()
