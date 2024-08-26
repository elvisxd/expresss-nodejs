import { Router } from 'express'
import { AuthController } from '../controllers/auth.js'

export const createLoginRouter = ({ loginModel }) => {
  const loginRouter = Router()
  const authController = new AuthController({ loginModel })
  // loginRouter.post('/login', authController.login)
  loginRouter.get('/:email', authController.getUserByEmail)

  loginRouter.post('/', authController.authenticate)

  loginRouter.get('/', authController.getAccessToken)

  loginRouter.post('/logout', authController.logout)

  return loginRouter
}
