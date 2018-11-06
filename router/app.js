const render = require('./lib/render');
const logger = require('koa-logger');
const Router = require('koa-router');
const koaBody = require('koa-body');

const Koa = require('koa');
const app = (module.exports = new Koa());
const { blue } = require('chalk');
const { log, info } = console;

// "database"

// const posts = [];

// middleware

app.use(logger());

app.use(render);

app.use(koaBody());

// route definitions
const router = new Router();
router.get('/n*', index);
const childRouter = new Router();
childRouter.get('/hello', index);
router.use('/liz', childRouter.routes());
// router.route('index');
// app.use(router.routes());
/**
 * 自定义middleware 调用koa-router
 */
// ts 定义 next 的返回值为 Promise ,而next 其实就是middleware
// declare namespace compose {
//   type Middleware<T> = (context: T, next: () => Promise<any>) => any;
//   type ComposedMiddleware<T> = (context: T, next?: () => Promise<any>) => Promise<void>;
// }
app.use(async function(ctx, next) {
  // await next();
  await router.routes()(ctx, next); // await 去掉不好使
});

/**
 * Post listing.
 */

async function index(ctx, next) {
  const { _matchedRoute: path } = ctx;
  log('change');
  console.log(blue(path));
  next();
  await ctx.render('index', { path });
}

// listen

if (!module.parent) app.listen(3000);
