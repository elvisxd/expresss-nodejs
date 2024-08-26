import { createApp } from './app.js'
import { UserModel } from './models/local-mysql-system/users.js'

//createApp({ movieModel:  MovieModel })
createApp({ userModel:  UserModel })