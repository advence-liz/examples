/**
 * This example simply sets the number of views from the same client
 * both as a cookie and as a response string.
 */

const Koa = require('koa')
const app = (module.exports = new Koa())
const proxy = require('./proxy')
app.use(
  proxy({
    host: 'http://localhost:3001', // proxy alicdn.com...
    match: /^\/view\//,
    jar: false // ...just the /static folder
  })
)
app.use(async function(ctx) {
  const n = ~~ctx.cookies.get('view', { path: '/proxy' }) + 1
  console.log(n, ctx.url)
  if (ctx.url.includes('proxy')) ctx.cookies.set('view', n, { path: '/proxy' })
  ctx.body = n + ' proxy' + ctx.url
})

if (!module.parent) app.listen(3000)
