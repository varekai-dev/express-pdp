import express from 'express'
import {
	createPostHandler,
	getAllPostsHandler,
	getPostHandler,
	removePostHandler,
	updatePostHandler,
} from '../controller/posts.controller'
import { createPostSchema, updatePostSchema } from '../schemas/posts.schema'
import validateResource from '../middleware/validate-resource.middleware'

export const postsRouter = express.Router()

postsRouter.get('/', getAllPostsHandler)
postsRouter.post('/', validateResource(createPostSchema), createPostHandler)
postsRouter.get('/:id', getPostHandler)
postsRouter.delete('/:id', removePostHandler)
postsRouter.patch('/:id', validateResource(updatePostSchema), updatePostHandler)
