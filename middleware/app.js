const Koa = require('koa')
const app = (module.exports = new Koa())

const one = (ctx, next) => {
  console.log('>> one')
  next()
  console.log('<< one')
}

const two = async (ctx, next) => {
  console.log('>> two')
  await next()
  console.log('<< two')
}

const three = async (ctx, next) => {
  console.log('>> three')
  next()
  console.log('<< three')
}

app.use(one)
app.use(two)
app.use(three)

app.use(async function(ctx) {
  ctx.body = 'liz'
  console.log('liz')
})

if (!module.parent) app.listen(3001)

// << one
// >> one
// >> two
// >> three
// liz
// << three
// << two
// << one
