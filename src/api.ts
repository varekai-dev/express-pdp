import express from 'express'
import { postsRouter } from './posts/posts.router'

export const api = express.Router()

api.use('/posts', postsRouter)
