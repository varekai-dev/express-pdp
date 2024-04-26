import { Request, Response } from 'express'
import { handleError } from '../utils/handleError'
import { getUser, subscribeUser } from '../service/user.service'

export async function getMeHandler(req: Request, res: Response) {
	try {
		const userId = req.user?.userId
		const user = await getUser(userId)
		res.send(user)
	} catch (error) {
		handleError(error, res)
	}
}

export async function getUserHandler(req: Request, res: Response) {
	try {
		const { id } = req.params
		const user = await getUser(id)
		res.send(user)
	} catch (error) {
		handleError(error, res)
	}
}

export async function pathSubscribeHandler(req: Request, res: Response) {
	try {
		const { id } = req.params
		const userId = req.user?.userId
		const message = await subscribeUser(id, userId)
		res.json({
			message,
		})
	} catch (error) {
		handleError(error, res)
	}
}
