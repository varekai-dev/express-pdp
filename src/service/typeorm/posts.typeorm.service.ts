import { CreatePostInput } from '../../schemas/posts.schema'
import { deleteFromS3Handler, getS3DownloadUrl } from '../upload.service'
import { ApiError } from '../../utils/apiError'
import { Post } from '../../entities/post.entity'
import { postRepository } from '../../repository/post.repository'

export async function findOnePostOrFail(id: string) {
	const post = await postRepository.findOneBy({
		_id: +id,
	})
	if (!post) {
		throw new ApiError({ message: 'Post not found', errorCode: 404 })
	}
	return post
}

export async function getAllPosts() {
	return await postRepository.find({})
}

export async function createPost(
	input: CreatePostInput['body'] & { imageUrl?: string; createdBy: string }
) {}

export async function getPost(id: string) {
	return await findOnePostOrFail(id)
}
updatePost

export async function removePost(id: string, userId?: string) {
	const post = await findOnePostOrFail(id)
	if (String(post.createdBy._id) !== String(userId)) {
		throw new ApiError({
			message: 'You are not authorized to delete this post',
			errorCode: 403,
		})
	}
	return await postRepository.delete({ _id: +id })
}

export async function updatePost(id: string, data: any) {
	const post = await findOnePostOrFail(id)
	return await postRepository.update(post, data)
}

export async function getPostDownload(id: string) {
	const post = await findOnePostOrFail(id)
	const url = await getS3DownloadUrl(post.imageUrl)
	return url
}
