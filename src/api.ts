import express from 'express'
import { postsRouter } from './routes/posts.routes'
import { authRouter } from './routes/auth.routes'

export const api = express.Router()

api.use('/posts', postsRouter)
api.use('/auth', authRouter)
