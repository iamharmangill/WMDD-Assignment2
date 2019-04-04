const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const pool = require('../../dbconfig/dbconfig')
const logger = require('pino')()


const app = new Koa()
app.use(bodyParser())


app.use(async ctx => {
  logger.info('Getting your request.')

  const todoId = await ctx.request.body.todoId
  if (todoId) {
    const item = await get(todoId)
    ctx.body = item || `No todo item was found with the id ${todoId}`
  } else {
    const list = await list()
    ctx.body = list || 'Nothing Found'
  }

})


async function get(todoId) {
  try {
    const qetTodoItem = `SELECT * FROM Todotable WHERE todoId = ${todoId}`
    const result = await pool.query(qetTodoItem)
    return result[0]
  } catch(error) {
    console.log(error)
  }
}

async function list() {
  try {
    const query = 'SELECT * FROM Todotable ORDER BY todoStatus, todoDueBy, todoItem'
    const result = await pool.query(query)
    return result
  } catch(error) {
    console.log(error)
  }
}

module.exports = app.callback()
