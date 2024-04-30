import { ApiError } from '../utils/apiError'
import { handleError } from '../utils/handleError'
import { logger } from '../utils/logger'
import { Response } from 'express'

jest.mock('../utils/logger')

describe('handleError', () => {
	it('should handle ApiError', () => {
		const mockError = new ApiError({
			message: 'Test ApiError',
			errorCode: 500,
		})
		const mockRes = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		} as unknown as Response

		handleError(mockError, mockRes)

		expect(logger.error).toHaveBeenCalledWith(mockError)
		expect(mockRes.status).toHaveBeenCalledWith(mockError.errorCode)
		expect(mockRes.send).toHaveBeenCalledWith({
			errorMessage: mockError.message,
		})
	})

	it('should handle generic Error', () => {
		const mockError = new Error('Test error')
		const mockRes = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		} as unknown as Response

		handleError(mockError, mockRes)

		expect(logger.error).toHaveBeenCalledWith(mockError)
		expect(mockRes.status).toHaveBeenCalledWith(400)
		expect(mockRes.send).toHaveBeenCalledWith({
			errorMessage: mockError.message,
		})
	})
})
