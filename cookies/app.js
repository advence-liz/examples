/**
 * This example simply sets the number of views from the same client
 * both as a cookie and as a response string.
 */

const Koa = require('koa')
const app = (module.exports = new Koa())

app.use(async function(ctx) {
  const n = ~~ctx.cookies.get('view') + 1

  console.log(n, ctx.url)
  // 加这个判断是为了排除 /favico的干扰，因为浏览器会自动发这个请求
  if (ctx.url.includes('view')) ctx.cookies.set('view', n, { path: '/view' })

  ctx.body = n + 'cookie'
})

if (!module.parent) app.listen(3001)
