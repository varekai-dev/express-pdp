import { Response, Request } from 'express'
import { postsService } from './posts.service'

export async function getAllPosts(req: Request, res: Response) {
	const posts = await postsService.getAllPosts()
	res.status(200).json(posts)
}

export async function createPost(req: Request, res: Response) {
	const newPost = await postsService.createPost(req.body)
	res.status(201).json(newPost)
}

export async function getPost(req: Request, res: Response) {
	const post = await postsService.getPost(req.params.id)
	res.status(200).json(post)
}

export async function removePost(req: Request, res: Response) {
	await postsService.removePost(req.params.id)
	res.status(204).json({
		status: 'success',
	})
}

export async function updatePost(req: Request, res: Response) {
	const updatedPost = await postsService.updatePost(req.params.id, req.body)
	res.status(204).json(updatedPost)
}
