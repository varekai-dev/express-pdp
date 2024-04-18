import { NextFunction, Request, Response } from 'express'
import logger from '../utils/logger'

export default function loggerMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const start = Date.now()
	next()
	const delta = Date.now() - start
	logger.info(`${req.method} ${req.baseUrl}${req.url} ${delta}ms`)
}
