import express from 'express'
import { postsRouter } from './routes/posts.routes'
import { authRouter } from './routes/auth.routes'
import { usersRouter } from './routes/user.routes'

export const api = express.Router()

api.use('/posts', postsRouter)
api.use('/auth', authRouter)
api.use('/users', usersRouter)
