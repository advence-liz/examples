const Koa = require('koa')

// koa app

const app = new Koa()

app.use(async function(ctx, next) {
  await next()
  ctx.set('X-Custom', 'Dub Dub Dub App')
  // ctx.body = 'Hello World';
})

app.use(async function(ctx, next) {
  await next()
  console.log(ctx.url)
  // if ('/' != ctx.url) return;

  ctx.body = `Hello from ${ctx.url}`
})

module.exports = app
