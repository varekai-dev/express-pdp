import { Request, Response } from 'express'
import * as postsMongoService from '../service/mongo/posts.mongo.service'
import * as postsTypeormService from '../service/typeorm/posts.typeorm.service'
import {
	CreatePostInput,
	DeletePostInput,
	DownloadPostInput,
	UpdatePostInput,
} from '../schemas/posts.schema'
import { uploadToS3Handler } from '../service/upload.service'
import { handleError } from '../utils/handleError'
import { sockets } from '../server'
import { getUser } from '../service/mongo/user.mongo.service'
import { SocketType } from '../enums/socket-type.enum'
import { ApiError } from '../utils/apiError'

const postsService =
	process.env.DATABASE_TYPE === 'mongodb'
		? postsMongoService
		: postsTypeormService

export async function getAllPostsHandler(req: Request, res: Response) {
	try {
		const posts = await postsService.getAllPosts()
		res.send(posts)
	} catch (error) {
		handleError(error, res)
	}
}

export async function getPostHandler(req: Request, res: Response) {
	try {
		const { id } = req.params
		if (!id) {
			res.sendStatus(404).json({
				errorMessage: 'Post id not provided',
			})
		}

		const post = await postsService.getPost(id)
		res.send(post)
	} catch (error) {
		handleError(error, res)
	}
}

export async function createPostHandler(
	req: Request<{}, {}, CreatePostInput['body']>,
	res: Response
) {
	try {
		const userId = req.user?.userId
		const postData = req.body
		let imageUrl

		if (!userId) {
			throw new ApiError({
				message: 'User id not provided',
				errorCode: 404,
			})
		}

		if (req.file) {
			imageUrl = await uploadToS3Handler(req.file)
		}
		const newPost = await postsService.createPost({
			...postData,
			imageUrl,
			createdBy: String(userId),
		})
		const currentUser = await getUser(userId)

		currentUser.subscribers.forEach(subscriber => {
			sockets.to(String(subscriber)).emit(SocketType.NewPost, newPost)
		})
		res.status(201).send(newPost)
	} catch (error) {
		handleError(error, res)
	}
}

export async function removePostHandler(
	req: Request<DeletePostInput['params']>,
	res: Response
) {
	try {
		const userId = req.user?.userId
		const { id } = req.params
		if (!id) {
			res.sendStatus(404).json({
				errorMessage: 'Post id not provided',
			})
		}
		await postsService.removePost(id, userId)
		res.status(204).send({
			status: 'success',
		})
	} catch (error) {
		handleError(error, res)
	}
}

export async function updatePostHandler(
	req: Request<UpdatePostInput['params']>,
	res: Response
) {
	const userId = req.user?.userId
	const { id } = req.params
	const data = req.body

	if (!id) {
		res.sendStatus(404).json({
			errorMessage: 'Post id not provided',
		})
	}

	try {
		const post = await postsService.findOnePostOrFail(id)
		if (String(userId) !== String(post.createdBy._id)) {
			throw new ApiError({
				message: 'You are not allowed to update this post',
				errorCode: 403,
			})
		}

		if (req.file) {
			const imageUrl = await uploadToS3Handler(req.file)
			data.imageUrl = imageUrl
		}
		const updatedPost = await postsService.updatePost(id, data)
		res.send(updatedPost)
	} catch (error) {
		handleError(error, res)
	}
}

export async function getPostDownloadHandler(
	req: Request<DownloadPostInput['params']>,
	res: Response
) {
	const { id } = req.params
	if (!id) {
		res.sendStatus(404).json({
			errorMessage: 'Post id not provided',
		})
	}
	const downloadUrl = await postsService.getPostDownload(id)
	res.redirect(downloadUrl)
	try {
	} catch (error) {
		handleError(error, res)
	}
}

export async function getPostRenderHandler(req: Request, res: Response) {
	try {
		const { id } = req.params
		if (!id) {
			res.sendStatus(404).json({
				errorMessage: 'Post id not provided',
			})
		}
		const post = await postsService.getPost(id)
		res.render('post.template.hbs', post)
	} catch (error) {
		handleError(error, res)
	}
}
