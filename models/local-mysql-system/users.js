import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../../config.js'

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'usersdb',
  port: 3306
}

// const connectionString = process.env.DATABASE_URL  ?? DEFAULT_CONFIG
const connection = await mysql.createConnection(DEFAULT_CONFIG)

export class UserModel {
  static async getAll () {
    const [rows] = await connection.query(`SELECT name, email, password, dob, gender, isActive, roles,
            createdAt, updatedAt, BIN_TO_UUID(id)  FROM users LIMIT 5`)
    return rows
  }

  static async getById ({ id }) {
    const [rows] = await connection.query(`SELECT name, email, password,  dob, gender, isActive, roles,
            createdAt, updatedAt FROM users WHERE id = UUID_TO_BIN(?)`, [id])
    if (rows.length === 0) return null
    return rows[0]
  }

  static async getByEmail ({ email, password }) {
    try {
      const [rows] = await connection.query('SELECT  name, email, password, roles, BIN_TO_UUID(id) FROM users WHERE email = ?', [email])
      if (rows.length === 0) {
        return null
      }

      if (password) {
        const user = rows[0]
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) throw new Error('Invalid password')
      }
      const { password: _, ...publicUser } = rows[0]
      return publicUser
    } catch (error) {
      return null
    }
  }

  static async create ({ input }) {
    const {
      name,
      email,
      password,
      dob,
      gender,
      isActive = true
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    try {
      const [result] = await connection.query(`INSERT INTO users (id, name, email, password, dob, gender, isActive, createdAt, updatedAt) 
            VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, NOW(), NOW());`,
      [uuid, name, email, hashedPassword, dob, gender, isActive])
    } catch (error) {
      return null
    }
  }

  static async update ({ id, input }) {
    const {
      name,
      email,
      password,
      dob,
      gender,
      isActive = true
    } = input

    try {
      const [result] = await connection.query(
                `UPDATE users SET name = ?, email = ?, password = ?, dob = ?, gender = ?, isActive = ?, updatedAt = NOW() 
                WHERE id = UUID_TO_BIN(?);`,
                [name, email, password, dob, gender, isActive, id]
      )

      if (result.affectedRows === 0) return null

      return {
        id,
        name,
        email,
        password,
        dob,
        gender,
        isActive
      }
    } catch (error) {
      throw new Error('Error updating user')
    }
  }

  static async delete ({ id }) {
    try {
      const [result] = await connection.query(
        'DELETE FROM users WHERE id = UUID_TO_BIN(?);',
        [id]
      )
      return result.affectedRows !== 0
    } catch (error) {
      throw new Error('Error deleting user')
    }
  }
}
