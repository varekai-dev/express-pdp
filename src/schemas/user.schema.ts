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
			.min(8)
			.max(64),
		username: string({
			required_error: 'Username is required',
		})
			.min(4)
			.max(16),
	}),
}

export const createUserSchema = object({
	...createPayload,
})

export type CreateUserInput = TypeOf<typeof createUserSchema>
