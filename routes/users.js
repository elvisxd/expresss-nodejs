import { Router } from 'express'
import { UserController } from '../controllers/users.js'

export const createUsersRouter = ({ userModel }) => {
  const usersRouter = Router()
  const userController = new UserController({ userModel })

  usersRouter.get('/', userController.getUsers)
  usersRouter.get('/:id', userController.getUserById)
  usersRouter.post('/', userController.createUser)
  usersRouter.patch('/:id', userController.updateUser)
  usersRouter.delete('/:id', userController.deleteUser)

  return usersRouter
}
