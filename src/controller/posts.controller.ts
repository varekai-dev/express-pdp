import { Request, Response } from 'express'

import {
	createPost,
	getAllPosts,
	getPost,
	removePost,
	updatePost,
} from '../service/posts.service'
import {
	CreatePostInput,
	DeletePostInput,
	UpdatePostInput,
} from '../schemas/posts.schema'
import logger from '../utils/logger'
import { uploadToS3Handler } from '../service/upload.service'

export async function getAllPostsHandler(req: Request, res: Response) {
	const posts = await getAllPosts()
	res.send(posts)
}

export async function getPostHandler(req: Request, res: Response) {
	try {
		const { id } = req.params
		const post = await getPost(id)
		res.send(post)
	} catch (error: any) {
		logger.error(error)
		res.status(404).send({
			error: error.message,
		})
	}
}

export async function createPostHandler(
	req: Request<{}, {}, CreatePostInput['body']>,
	res: Response
) {
	try {
		const postData = req.body
		let imageUrl

		if (req.file) {
			imageUrl = await uploadToS3Handler(req.file)
		}
		const newPost = await createPost({
			...postData,
			imageUrl,
		})
		res.status(201).send(newPost)
	} catch (error: any) {
		logger.error(error)
		res.status(409).send({
			error: error.message,
		})
	}
}

export async function removePostHandler(
	req: Request<DeletePostInput['params']>,
	res: Response
) {
	try {
		const { id } = req.params
		await removePost(id)
		res.send({
			status: 'success',
		})
	} catch (error: any) {
		logger.error(error)
		res.status(404).send({
			error: error.message,
		})
	}
}

export async function updatePostHandler(
	req: Request<UpdatePostInput['params']>,
	res: Response
) {
	const { id } = req.params
	const data = req.body

	try {
		if (req.file) {
			const imageUrl = await uploadToS3Handler(req.file)
			data.imageUrl = imageUrl
		}
		const updatedPost = await updatePost(id, data)
		res.send(updatedPost)
	} catch (error: any) {
		logger.error(error)
		res.status(404).send({
			error: error.message,
		})
	}
}
