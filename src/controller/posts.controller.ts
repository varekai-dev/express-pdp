import { Request, Response } from 'express'

import {
	createPost,
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
	} catch (error) {
		handleError(error, res)
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
	} catch (error) {
		handleError(error, res)
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
