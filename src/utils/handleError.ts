import { Response } from 'express'
import logger from './logger'

export function handleError(error: unknown, res: Response) {
	logger.error(error)
	if (error instanceof Error) {
		res.status(404).send({
			error: error.message,
		})
	}
}
