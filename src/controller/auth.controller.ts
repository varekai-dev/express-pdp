import { Request, Response } from 'express'
import { CreateUserInput } from '../schemas/user.schema'
import { handleError } from '../utils/handleError'
import * as mongoUserService from '../service/mongo/user.mongo.service'
import * as typeormUserService from '../service/typeorm/user.typeorm.service'

const DATABASE_TYPE = process.env.DATABASE_TYPE

const userService =
	DATABASE_TYPE === 'mongo' ? mongoUserService : typeormUserService

export async function httpPostRegisterHandler(
	req: Request<{}, {}, CreateUserInput['body']>,
	res: Response
) {
	try {
		const { email, password, username } = req.body

		const newUser = await userService.registerUser({
			email,
			password,
			username,
		})
		res.send(newUser)
	} catch (error) {
		handleError(error, res)
	}
}

export async function httpPostLoginHandler(req: Request, res: Response) {
	try {
		const { email, password } = req.body
		const tokens = await userService.loginUser(email, password)
		res.send(tokens)
	} catch (error) {
		handleError(error, res)
	}
}

export async function httpGoogleAuthHandler(req: Request, res: Response) {
	try {
		const username = req.user?.displayName
		const email = req.user?.emails?.[0].value
		const { refreshToken, accessToken } = await userService.googleLogin(
			email!,
			username!
		)
		res.redirect(
			`${process.env.FRONTEND_URI}/login?accessToken=${refreshToken}&refreshToken=${accessToken}`
		)
	} catch (error) {
		handleError(error, res)
	}
}
