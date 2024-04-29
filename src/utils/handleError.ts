import { Response } from 'express'
import { logger } from './logger'
import { ApiError } from './apiError'

export function handleError(error: unknown, res: Response) {
	logger.error(error)
	if (error instanceof ApiError) {
		res.status(error.errorCode).send({
			errorMessage: error.message,
		})
	} else if (error instanceof Error) {
		res.status(400).send({
			errorMessage: error.message,
		})
	}
}
