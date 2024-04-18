import express from 'express'
import {
	createPost,
	getAllPosts,
	getPost,
	removePost,
	updatePost,
} from './posts.controller'

export const postsRouter = express.Router()

postsRouter.get('/', getAllPosts)
postsRouter.post('/', createPost)
postsRouter.get('/:id', getPost)
postsRouter.delete('/:id', removePost)
postsRouter.patch('/:id', updatePost)
