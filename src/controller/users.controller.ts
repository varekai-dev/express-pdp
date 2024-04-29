import { Request, Response } from 'express'
import { handleError } from '../utils/handleError'
import { getUser, subscribeUser } from '../service/user.service'
import { ApiError } from '../utils/apiError'

export async function getMeHandler(req: Request, res: Response) {
	try {
		const userId = req.user?.userId
		if (!userId) {
			throw new ApiError({
				message: 'User id not provided',
				errorCode: 404,
			})
		}
		const user = await getUser(userId)
		res.send(user)
	} catch (error) {
		handleError(error, res)
	}
}

export async function getUserHandler(req: Request, res: Response) {
	try {
		const { id } = req.params
		if (!id) {
			res.sendStatus(404).json({
				errorMessage: 'User id not provided',
			})
		}
		const user = await getUser(id)
		res.send(user)
	} catch (error) {
		handleError(error, res)
	}
}

export async function pathSubscribeHandler(req: Request, res: Response) {
	try {
		const { id } = req.params
		if (!id) {
			res.sendStatus(404).json({
				errorMessage: 'User id not provided',
			})
		}
		const userId = req.user?.userId
		const message = await subscribeUser(id, userId)
		res.json({
			message,
		})
	} catch (error) {
		handleError(error, res)
	}
}
