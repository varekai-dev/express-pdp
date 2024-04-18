import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import postsModel from './schemas/posts.schema'

async function getAllPosts() {
	return await postsModel.find({})
}

async function createPost(data: CreatePostDto) {
	try {
		const { title, content } = data

		if (!title || !content) {
			throw new Error('Title and content are required')
		}
		const newPost = await postsModel.create({
			title,
			content,
		})
		return newPost
	} catch (error) {
		throw new Error(String(error))
	}
}

async function getPost(id: string) {
	try {
		const postExist = await postsModel.findById(id)
		if (!postExist) {
			throw new Error('Post not found')
		}
		return postExist
	} catch (error) {
		throw new Error(String(error))
	}
}

async function removePost(id: string) {
	try {
		const postExist = await postsModel.findById(id)
		if (!postExist) {
			throw new Error('Post not found')
		}
		await postsModel.findByIdAndDelete(id)
	} catch (error) {
		throw new Error(String(error))
	}
}

async function updatePost(id: string, data: UpdatePostDto) {
	try {
		const postExist = await postsModel.findById(id)
		if (!postExist) {
			throw new Error('Post not found')
		}
		const updatedPost = await postsModel.findByIdAndUpdate(
			id,
			{
				$set: {
					...(data.title && { title: data.title }),
					...(data.content && { content: data.content }),
				},
			},
			{
				new: true,
			}
		)
		return updatedPost
	} catch (error) {
		throw new Error(String(error))
	}
}

export const postsService = {
	getAllPosts,
	createPost,
	getPost,
	removePost,
	updatePost,
}
