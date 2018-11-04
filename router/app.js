const render = require('./lib/render');
const logger = require('koa-logger');
const router = require('koa-router')();
const koaBody = require('koa-body');

const Koa = require('koa');
const app = (module.exports = new Koa());
const { log, info } = console;
// "database"

// const posts = [];

// middleware

app.use(logger());

app.use(render);

app.use(koaBody());

// route definitions

router.get('/*', index);
router.get('routername','/liz/*', index);
router.route('index')
app.use(router.routes());

/**
 * Post listing.
 */

async function index(ctx) {
  const { 0: path } = ctx.params;
  console.log(path);
  await ctx.render('index', { path });
}

// listen

if (!module.parent) app.listen(3000);
