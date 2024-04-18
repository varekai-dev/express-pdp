import { any, object, string } from 'zod'
import { MAX_FILE_SIZE_MB } from '../constants/maxSize'

export const fileValidation = object(
	{
		mimetype: string().refine(value => value.startsWith('image/'), {
			message: 'File should be an image',
		}),
		size: any().refine(size => size <= MAX_FILE_SIZE_MB * 1024 * 1024, {
			message: `File size should be less than ${MAX_FILE_SIZE_MB}MB`,
		}),
	},
	{
		required_error: 'File is required',
	}
)
