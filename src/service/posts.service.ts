import { UpdateQuery, Types } from 'mongoose'
import postModel, { PostDocument } from '../models/post.model'
import { CreatePostInput } from '../schemas/posts.schema'
import { deleteFromS3Handler, getS3DownloadUrl } from './upload.service'
import { ApiError } from '../utils/apiError'

export async function findOnePostOrFail(id: string) {
	const post = await postModel
		.findById(new Types.ObjectId(id))
		.select('-__v')
		.populate('createdBy', 'username _id')
	if (!post) {
		throw new ApiError({ message: 'Post not found', errorCode: 404 })
	}
	return post
}

export async function getAllPosts() {
	return await postModel.find({}).populate('createdBy', 'username _id')
}

export async function createPost(
	input: CreatePostInput['body'] & { imageUrl?: string; createdBy: string }
) {
	return await postModel.create(input)
}

export async function getPost(id: string) {
	return await findOnePostOrFail(id)
}

export async function removePost(id: string, userId?: string) {
	const post = await findOnePostOrFail(id)
	if (String(post.createdBy._id) !== String(userId)) {
		throw new ApiError({
			message: 'You are not authorized to delete this post',
			errorCode: 403,
		})
	}
	return await postModel.findByIdAndDelete(new Types.ObjectId(id))
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
