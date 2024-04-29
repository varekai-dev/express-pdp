import { TypeOf, object, string } from 'zod'
import { fileValidation } from '../validation/file.validation'

const createPayload = {
	body: object({
		title: string({
			required_error: 'Title is required',
		})
			.min(1, {
				message: 'Title should be at least 1 character long',
			})
			.max(255, {
				message: 'Title should be at most 255 characters long',
			}),
		content: string({
			required_error: 'Content is required',
		})
			.min(4, {
				message: 'Content should be at least 4 characters long',
			})
			.max(1000, {
				message: 'Content should be at most 1000 characters long',
			}),
	}),
	file: fileValidation,
}

const updatePayload = {
	body: createPayload.body.partial(),
	file: fileValidation.optional(),
}

const params = {
	params: object({
		id: string({
			required_error: 'Post ID is required',
		}),
	}),
}

export const createPostSchema = object({
	...createPayload,
})

export const deletePostSchema = object({
	...params,
})

export const downloadPostSchema = object({
	...params,
})

export const updatePostSchema = object({
	...params,
	...updatePayload,
})

export type UpdatePostInput = TypeOf<typeof updatePostSchema>

export type CreatePostInput = TypeOf<typeof createPostSchema>

export type DeletePostInput = TypeOf<typeof deletePostSchema>

export type DownloadPostInput = TypeOf<typeof downloadPostSchema>
