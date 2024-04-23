import { TypeOf, object, string } from 'zod'
import { fileValidation } from '../validation/file.validation'

const createPayload = {
	body: object({
		title: string({
			required_error: 'Title is required',
		})
			.min(1)
			.max(255),
		content: string({
			required_error: 'Content is required',
		})
			.min(4)
			.max(1000),
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
