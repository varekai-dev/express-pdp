import express from 'express'
import { postsRouter } from './routes/posts.routes'
import { uploadRouter } from './routes/upload.routes'
export const api = express.Router()

api.use('/posts', postsRouter)

api.use('/upload', uploadRouter)
