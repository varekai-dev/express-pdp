import express from 'express'
import {
	createPostHandler,
	getAllPostsHandler,
	getPostHandler,
	removePostHandler,
	updatePostHandler,
	getPostDownloadHandler,
	getPostRenderHandler,
} from '../controller/posts.controller'
import { createPostSchema, updatePostSchema } from '../schemas/posts.schema'
import validateResource from '../middleware/validate-resource.middleware'
import multer from 'multer'

const upload = multer({ storage: multer.memoryStorage() })

export const postsRouter = express.Router()

postsRouter.get('/', getAllPostsHandler)
postsRouter.post(
	'/',
	upload.single('file'),
	validateResource(createPostSchema),
	createPostHandler
)
postsRouter.get('/:id', getPostHandler)
postsRouter.delete('/:id', removePostHandler)
postsRouter.patch(
	'/:id',
	upload.single('file'),
	validateResource(updatePostSchema),
	updatePostHandler
)
postsRouter.get('/:id/render', getPostRenderHandler)
postsRouter.get('/:id/download', getPostDownloadHandler)
