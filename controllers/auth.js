import { UserModel } from '../models/local-mysql-system/users.js'
import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY } from '../config.js'

export class AuthController {
  constructor ({ loginModel }) {
    this.loginModel = loginModel
  }

  getUserByEmail = async (req, res) => {
    const { email } = req.params
    const user = await UserModel.getByEmail({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  }

  authenticate = async (req, res) => {
    const { email, password } = req.body
    try {
      const user = await UserModel.getByEmail({ email, password })
      if (!user) {
        return res.render('index')
      }

      // Aquí puedes generar un token JWT o realizar cualquier otra acción necesaria
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_JWT_KEY, { expiresIn: '1h' })

      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 // 1 hour
      }).send({ token, user })
      // return res.status(200).json({ message: 'Authentication successful', token, user })
    } catch (error) {
      return res.render('index')
    }
  }

  getAccessToken = (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.render('index')

    try {
      const data = jwt.verify(token, SECRET_JWT_KEY)
      res.render('protected', data)
    } catch (error) {
      res.render('index')
    }
  }

  logout = (req, res) => {
    res.clearCookie('access_token')
    res.redirect('/')
  }
}
