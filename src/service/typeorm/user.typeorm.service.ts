import { typeOrm } from '../../config/typeorm'
import { User } from '../../entities/user.entity'
import { CreateUserInput } from '../../schemas/user.schema'
import { ApiError } from '../../utils/apiError'
import { generateTokens } from '../../utils/generateTokens'
import { hashPassword } from '../../utils/hashPassword'
import bcrypt from 'bcrypt'

const userRepository = typeOrm.getRepository(User)

export async function registerUser(user: CreateUserInput['body']) {
	const hashedPassword = await hashPassword(user.password)
	const emailExist = await userRepository.findOneBy({
		email: user.email,
	})
	if (emailExist) {
		throw new ApiError({
			message: 'Email already exists',
			errorCode: 400,
		})
	}
	const usernameExist = await userRepository.findOneBy({
		username: user.username,
	})
	if (usernameExist) {
		throw new ApiError({
			message: 'Username already exists',
			errorCode: 400,
		})
	}
	const newUser = await userRepository.save(
		userRepository.create({
			...user,
			password: hashedPassword,
		})
	)

	const { password, ...userObject } = newUser
	const tokens = generateTokens(String(newUser._id))
	return {
		...userObject,
		...tokens,
	}
}

export async function loginUser(email: string, password: string) {
	const findUser = await userRepository.findOneBy({
		email,
	})
	if (!findUser) {
		throw new ApiError({
			message: 'Email or password is wrong',
			errorCode: 400,
		})
	}
	const validPassword = await bcrypt.compare(password, findUser.password)
	if (!validPassword) {
		throw new ApiError({
			message: 'Email or password is wrong',
			errorCode: 400,
		})
	}
	return generateTokens(String(findUser._id))
}

export async function googleLogin(email: string, username: string) {
	return generateTokens(String(1))
}

export async function getUser(id: string) {}

export async function subscribeUser(id: string, userId: string) {}
