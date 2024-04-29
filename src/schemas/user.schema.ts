import { TypeOf, object, string } from 'zod'

const createPayload = {
	body: object({
		email: string({
			required_error: 'Email is required',
		}).email({
			message: 'Invalid email',
		}),
		password: string({
			required_error: 'Password is required',
		})
			.min(8, 'Password must be at least 8 characters')
			.max(64, 'Password must be at most 64 characters'),
		username: string({
			required_error: 'Username is required',
		})
			.min(4, 'Username must be at least 4 characters')
			.max(16, 'Username must be at most 16 characters'),
	}),
}

export const createUserSchema = object({
	...createPayload,
})

export type CreateUserInput = TypeOf<typeof createUserSchema>
