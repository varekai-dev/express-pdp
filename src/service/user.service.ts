import { CreateUserInput } from '../schemas/user.schema'
import bcrypt from 'bcrypt'
import userModel from '../models/user.model'
import { AuthType } from '../enums/auth-type.enum'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import { ApiError } from '../utils/apiError'

export async function findOneUserOrFail(id: string) {
	const user = await userModel
		.findById(new Types.ObjectId(id))
		.select('-__v -password -authType')
	if (!user) {
		throw new ApiError({
			message: 'User not found',
			errorCode: 404,
		})
	}
	return user
}

function generateJwtToken(userId: string, expiresIn: number) {
	return jwt.sign({ userId }, String(process.env.JWT_SECRET), {
		expiresIn: expiresIn,
	})
}

async function hashPassword(password: string) {
	const salt = await bcrypt.genSalt(10)
	const hashedPassword = await bcrypt.hash(password, salt)

	return hashedPassword
}

export function generateTokens(userId: string) {
	const accessToken = generateJwtToken(
		userId,
		Number(process.env.JWT_ACCESS_TOKEN_TTL)
	)
	const refreshToken = generateJwtToken(
		userId,
		Number(process.env.JWT_REFRESH_TOKEN_TTL)
	)
	return { accessToken, refreshToken }
}

export async function registerUser(user: CreateUserInput['body']) {
	const hashedPassword = await hashPassword(user.password)
	const emailExist = await userModel.findOne({ email: user.email })
	if (emailExist) {
		throw new ApiError({
			message: 'Email already exists',
			errorCode: 400,
		})
	}

	const usernameExist = await userModel.findOne({ username: user.username })

	if (usernameExist) {
		throw new ApiError({
			message: 'Username already exists',
			errorCode: 400,
		})
	}

	const newUser = await userModel.create({
		...user,
		password: hashedPassword,
	})

	const userObject = newUser.toObject()
	delete userObject.password

	const tokens = generateTokens(String(userObject._id))
	return { ...userObject, ...tokens }
}

export async function loginUser(email: string, password: string) {
	const findUser = await userModel.findOne({ email })
	if (!findUser) {
		throw new ApiError({
			message: 'Email or password is wrong',
			errorCode: 400,
		})
	}

	if (findUser.authType === AuthType.Local && findUser.password) {
		const validPassword = await bcrypt.compare(password, findUser.password)
		if (!validPassword) {
			throw new ApiError({
				message: 'Email or password is wrong',
				errorCode: 400,
			})
		}
	}
	return generateTokens(String(findUser._id))
}

export async function googleLogin(email: string, username: string) {
	let userInDb = await userModel.findOne({ email })
	if (!userInDb) {
		userInDb = await userModel.create({
			email,
			authType: AuthType.Google,
			username,
		})
	}
	return generateTokens(String(userInDb._id))
}

export async function getUser(id: string) {
	const user = await userModel
		.findById(new Types.ObjectId(id))
		.select('-password -__v -updatedAt')
	if (!user) {
		throw new ApiError({
			message: 'User not found',
			errorCode: 404,
		})
	}
	return user
}

export async function subscribeUser(id: string, userId?: string) {
	const user = await findOneUserOrFail(id)
	let message = ''
	if (String(id) === String(userId)) {
		throw new ApiError({
			message: 'You cannot subscribe to yourself',
			errorCode: 400,
		})
	}
	if (user.subscribers.includes(new Types.ObjectId(userId))) {
		const updatedSubscribers = user.subscribers.filter(
			subscriber => String(subscriber) !== String(userId)
		)
		user.subscribers = updatedSubscribers
		message = 'Unsubscribed successfully'
	} else {
		user.subscribers.push(new Types.ObjectId(userId))
		message = 'Subscribed successfully'
	}
	await user.save()
	return message
}
