const jsonServer = require('json-server')
const server = jsonServer.create()
const middlewares = jsonServer.defaults() // { static: 'public' }
const JsonServerRouter = require('../index.js')
const router = new JsonServerRouter()
server.use(middlewares)

server.use(router.routes())

server.listen(3000, () => {
  console.log('JSON Server is running')
})
