const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors = require('cors')
const {
  notFound,
  errorHandler,
} = require('./backend/middleware/errorMiddleware.js')

const connectDB = require('./backend/utills/db.js')
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Configurations
app.use(express.json())
connectDB()
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
  app.use(cors())
}

// routes

app.use('/api/user', require('./backend/routes/UserRoutes.js'))
app.use('/api/post', require('./backend/routes/PostRoute.js'))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log('app is running on port ' + PORT)
})
