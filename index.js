require('dotenv').config()
const path = require('path')
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const router = require('./routes/routes')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
// const add = require('./add')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)

app.use(errorHandler)

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    
    app.listen(PORT, () => {
      console.log(`port ${PORT}`)
    })
  } catch(e) {
    console.log(e)
  }
}

start()

// add.add()