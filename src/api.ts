import express from 'express'
import { postsRouter } from './routes/posts.routes'

export const api = express.Router()

api.use('/posts', postsRouter)
