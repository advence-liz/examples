var koa = require('koa')
var app = (module.exports = koa())

app.use(function*() {
  this.body = 'Hello World'
})

if (!module.parent) app.listen(3000)

// 以下是一个无作用的 Koa 应用程序被绑定到 3000 端口：

// const Koa = require('koa');
// const app = new Koa();
// app.listen(3000);
// 这里的 app.listen(...) 方法只是以下方法的语法糖:

// const http = require('http');
// const Koa = require('koa');
// const app = new Koa();
// http.createServer(app.callback()).listen(3000);