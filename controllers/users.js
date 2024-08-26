import { validateUser, validatePartialUser } from '../schemas/users.js'

export class UserController {
  constructor ({ userModel }) {
    this.userModel = userModel
  }

  getUsers = async (req, res) => {
    const users = await this.userModel.getAll()
    res.json(users)
  }

  getUserById = async (req, res) => {
    const { id } = req.params
    const user = await this.userModel.getById({ id })
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }
    res.json(user)
  }

  createUser = async (req, res) => {
    const result = validateUser(req.body)
    if (!result.success) {
      res.status(400).json({ errors: JSON.parse(result.error.message) })
      return
    }
    const newUser = await this.userModel.create({ input: result.data })
    res.status(201).json(newUser)
  }

  updateUser = async (req, res) => {
    const result = validatePartialUser(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const { id } = req.params
    const updatedUser = await this.userModel.update({ id, input: result.data })
    return res.json(updatedUser)
  }

  deleteUser = async (req, res) => {
    const { id } = req.params
    const result = await this.userModel.delete({ id })
    if (result === false) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({ message: 'User deleted' })
  }
}
