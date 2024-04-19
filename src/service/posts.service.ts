import { UpdateQuery, Types } from 'mongoose'
import postModel, { PostDocument } from '../models/post.model'
import { CreatePostInput } from '../schemas/posts.schema'
import { deleteFromS3Handler, getS3DownloadUrl } from './upload.service'

async function findOnePostOrFail(id: string) {
	const post = await postModel.findById(new Types.ObjectId(id)).select('-__v')
	if (!post) {
		throw new Error('Post not found')
	}
	return post
}

export async function getAllPosts() {
	return await postModel.find({})
}

export async function createPost(
	input: CreatePostInput['body'] & { imageUrl?: string }
) {
	return await postModel.create(input)
}

export async function getPost(id: string) {
	return await findOnePostOrFail(id)
}

export async function removePost(id: string) {
	await findOnePostOrFail(id)
	return await postModel.findByIdAndDelete(id)
}

export async function updatePost(
	id: string,
	data: UpdateQuery<Partial<PostDocument>>
) {
	const post = await findOnePostOrFail(id)
	if (data.imageUrl) {
		await deleteFromS3Handler(post.imageUrl)
	}
	post.set({
		...(data.imageUrl && { imageUrl: data.imageUrl }),
		...(data.title && { title: data.title }),
		...(data.content && { content: data.content }),
	})
	return post.save()
}

export async function getPostDownload(id: string) {
	const post = await findOnePostOrFail(id)
	const downloadUrl = getS3DownloadUrl(post.imageUrl)
	return downloadUrl
}
