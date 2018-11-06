const jsonServer = require('json-server')
const server = jsonServer.create()
// const router = jsonServer.router(require('./src/index'));
// const testRouter = jsonServer.router('test.json');
const { green, blue } = require('chalk')
const debug = require('debug')('deer')
const glob = require('glob')
const middlewares = jsonServer.defaults() // { static: 'public' }
const path = require('path')

server.use(middlewares)
/**
 * 传入opts
 * @param {*} opts
 */
const DeerRouter = function(opts = { root: 'src' }) {
  if (!(this instanceof DeerRouter)) {
    return new DeerRouter(opts)
  }
  this.isInit = true
  // 单纯为了跟koa-router 接口一样
  this.routes = () => (req, res, next) => {
    const app = req.app
    let { root } = opts
    root = root.replace(/\/$/, '')
    if (this.isInit) {
      const routeSources = glob.sync(`${root}/**/*.{js,json}`)
      routeSources.forEach(filePath => {
        const prefix = filePath
          .replace(/\.(js|json)$/, '')
          .replace(/\/index$/, '')
          .replace(root, '')
        const routes = require(path.resolve(process.cwd(), filePath))
        app.use(prefix, jsonServer.router(routes))

        debug(blue('file'), green(path.resolve(process.cwd(), filePath)))
        for (let key in routes) {
          debug(blue(`${prefix}/${key}`))
        }
      })

      this.isInit = false
    }
    next()
  }
}

server.use(new DeerRouter().routes())

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
server.listen(3000, () => {
  console.log('JSON Server is running')
})
