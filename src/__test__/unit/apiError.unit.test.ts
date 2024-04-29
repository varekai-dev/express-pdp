import { ApiError } from '../../utils/apiError'

describe('ApiError', () => {
	it('should create an instance of ApiError', () => {
		const error = new ApiError({
			message: 'Test error',
			errorCode: 400,
		})
		expect(error).toBeInstanceOf(ApiError)
		expect(error.message).toBe('Test error')
		expect(error.errorCode).toBe(400)
	})
})
