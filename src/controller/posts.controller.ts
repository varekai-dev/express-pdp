import { Request, Response } from 'express'
import {
	createPost,
	findOnePostOrFail,
	getAllPosts,
	getPost,
	getPostDownload,
	removePost,
	updatePost,
} from '../service/posts.service'
import {
	CreatePostInput,
	DeletePostInput,
	DownloadPostInput,
	UpdatePostInput,
} from '../schemas/posts.schema'
import { uploadToS3Handler } from '../service/upload.service'
import { handleError } from '../utils/handleError'
import { sockets } from '../server'
import { getUser } from '../service/user.service'
import { SocketType } from '../enums/socket-type.enum'

export async function getAllPostsHandler(req: Request, res: Response) {
	try {
		const posts = await getAllPosts()
		res.send(posts)
	} catch (error) {
		handleError(error, res)
	}
}

export async function getPostHandler(req: Request, res: Response) {
	try {
		const { id } = req.params
		const post = await getPost(id)
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

		if (req.file) {
			imageUrl = await uploadToS3Handler(req.file)
		}
		const newPost = await createPost({
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
		await removePost(id, userId)
		res.send({
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

	try {
		const post = await findOnePostOrFail(id)
		if (String(userId) !== String(post.createdBy._id)) {
			throw new Error('Unauthorized')
		}

		if (req.file) {
			const imageUrl = await uploadToS3Handler(req.file)
			data.imageUrl = imageUrl
		}
		const updatedPost = await updatePost(id, data)
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
	const downloadUrl = await getPostDownload(id)
	res.redirect(downloadUrl)
	try {
	} catch (error) {
		handleError(error, res)
	}
}

export async function getPostRenderHandler(req: Request, res: Response) {
	try {
		const { id } = req.params
		const post = await getPost(id)
		res.render('post.template.hbs', post)
	} catch (error) {
		handleError(error, res)
	}
}
