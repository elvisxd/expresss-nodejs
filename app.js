import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import { createUsersRouter } from './routes/users.js'
import { createLoginRouter } from './routes/login.js'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import { PORT } from './config.js'
import path from 'path'
import { fileURLToPath } from 'url'

// Define __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const createApp = ({ userModel }) => {
  const app = express()
  app.use(cookieParser())
  app.set('view engine', 'ejs')
  app.use(json())
  app.use(corsMiddleware())
  app.disable('x-powered-by')
  app.use('/assets', express.static(path.join(__dirname, 'assets')))
  app.use('/users', createUsersRouter({ userModel }))
  app.use('/login', createLoginRouter({ userModel }))
  app.use('/protected', createLoginRouter({ userModel }))
  app.use('/', createLoginRouter({ userModel }))

  app.get('/protected', (req, res) => {
    res.render('protected', { title: 'Protected' })
  })

  app.get('/', (req, res) => {
    res.render('index', { title: 'Login' })
  })

  // const PORT = process.env.PORT ?? 1234

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}
