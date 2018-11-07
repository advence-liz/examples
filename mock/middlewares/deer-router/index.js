const { green, blue } = require('chalk')
const debug = require('debug')('deer')
const glob = require('glob')
const jsonServer = require('json-server')
const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const opn = require('opn')
let $IsInit = true
/**
 * 传入opts
 * @param { Object } opts { root: 'src', port: 3000, publicPath: 'public' }
 * @description
 * root mock 文件所在目录
 * port app 端口号
 * publicPath 生成首页的路径
 */
class DeerRouter {
  constructor(opts = {}) {
    this.opts = {
      ...{ root: 'src', port: 3000, publicPath: 'public' },
      ...opts
    }
    debug('context', path.resolve('root'))
    debug('opts', this.opts)
    this.routeStore = []
    this._init()
  }
  get routeSources() {
    const { root } = this.opts
    // 根据process.cwd()
    return glob.sync(`${root}/**/*.{js,json}`)
  }
  _init() {
    let { root, port, publicPath } = this.opts
    const templateStore = []
    this.routeSources.forEach(filePath => {
      const prefix = filePath
        .replace(/\.(js|json)$/, '')
        .replace(/\/index$/, '')
        .replace(root, '')
      // 一个文件代表多个路由所以命名为routes
      const routes = require(path.resolve(process.cwd(), filePath))
      this.routeStore.push(new PartRouter(routes, prefix))
      logDebugInfo(filePath, routes, prefix)
      templateStore.push(new PartTemplate(routes, prefix, port).render())
    })

    publicPath && createTemlate(templateStore, publicPath)
    publicPath && console.info(green(`❤️  visit `), blue(`http://localhost:${port}/`))
    publicPath && opn(`http://localhost:${port}/`)
  }
  // 单纯为了跟koa-router 接口一样
  routes() {
    return (req, res, next) => {
      const app = req.app
      if ($IsInit) {
        this.routeStore.forEach(partRouter => {
          partRouter.routes(app)
        })

        $IsInit = false
      }
      next()
    }
  }
}
function logDebugInfo(filePath, routes, prefix) {
  debug(blue('file'), green(filePath))
  for (let key in routes) {
    debug(blue(`${prefix}/${key}`))
  }
}
function PartRouter(routes, prefix) {
  this.routes = app => app.use(prefix, jsonServer.router(routes))
}
function PartTemplate(routes, prefix, port) {
  const arr = []
  this.render = () => {
    arr.push(` <h3 class="bg-primary">${prefix}</h3>`)
    arr.push(`<ul>`)
    for (let key in routes) {
      arr.push(
        `<li> <a href="http://localhost:${port}${prefix}/${key}">${prefix}/${key} </a></li>`
      )
    }
    arr.push(`</ul>`)
    return arr.join('\n')
  }
}
function createTemlate(templateStore, publicPath) {
  const _template = fs.readFileSync(path.join(__dirname, '_template.ejs'))
  fs.writeFileSync(
    path.join(publicPath, 'index.html'),
    _.template(_template)({ body: templateStore.join('\n') })
  )
}
module.exports = DeerRouter
