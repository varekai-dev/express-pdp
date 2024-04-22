import { CreateUserInput } from '../schemas/user.schema'
import bcrypt from 'bcrypt'
import userModel from '../models/user.model'
import { AuthType } from '../enums/auth-type.enum'
import jwt from 'jsonwebtoken'

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

function generateTokens(userId: string) {
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
		throw new Error('Email already exists')
	}

	const usernameExist = await userModel.findOne({ username: user.username })

	if (usernameExist) {
		throw new Error('Username already exists')
	}

	const newUser = await userModel.create({
		...user,
		password: hashedPassword,
	})

	const userObject = newUser.toObject()
	delete userObject.password
	return userObject
}

export async function loginUser(email: string, password: string) {
	const findUser = await userModel.findOne({ email })
	if (!findUser) {
		throw new Error('Email or password is wrong')
	}

	if (findUser.authType === AuthType.Local && findUser.password) {
		const validPassword = await bcrypt.compare(password, findUser.password)
		if (!validPassword) {
			throw new Error('Email or password is wrong')
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
