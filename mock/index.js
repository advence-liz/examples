const jsonServer = require('json-server')
const server = jsonServer.create()

const middlewares = jsonServer.defaults() // { static: 'public' }

const DeerRouter = require('./middlewares/deer-router')
const router = new DeerRouter()
server.use(middlewares)

server.use(router.routes())

server.listen(3000, () => {
  console.log('JSON Server is running')
})

/**
 * 这样搞只有第一个生效
 */
// server.use((req, res, next) => {
//   jsonServer.router(require('./src/posts.json'))(req, res, next)
// })
// server.use((req, res, next) => {
//   jsonServer.router(require('./src/test.js'))(req, res, next)
// })
/**
 * 多文件多路由的方案，`/posts` 如果没有`/` 代码就无效无声无息的挂
 * 并且此方案下首页不会生成索引
 * 需要自己生成一个索引
 */
// server.use('/posts', jsonServer.router(require('./src/posts')))
// server.use('/test', jsonServer.router(require('./src/test')))
/**
 * 可以整合多个文件的初步方案
 */
// server.use(jsonServer.router(require('./src/index')))
