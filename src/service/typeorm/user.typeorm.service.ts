import { userRepository } from '../../repository/user.repository'
import { CreateUserInput } from '../../schemas/user.schema'
import { ApiError } from '../../utils/apiError'
import { generateTokens } from '../../utils/generateTokens'
import { hashPassword } from '../../utils/hashPassword'
import bcrypt from 'bcrypt'

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
	let userId: number
	const user = await userRepository.findOneBy({ email })
	if (!user) {
		const newUser = await userRepository.save(
			userRepository.create({
				email,
				username,
				password: '',
			})
		)
		userId = newUser._id
	} else {
		userId = user._id
	}

	return generateTokens(String(userId))
}

export async function getUser(id: string) {
	const user = await userRepository.findOneBy({ _id: Number(id) })
	if (!user) {
		throw new ApiError({
			message: 'User not found',
			errorCode: 404,
		})
	}
	const { password, ...userObject } = user
	return userObject
}

export async function subscribeUser(
	subscribeToId: string,
	currentUserId?: string
) {
	let message = ''
	const subscribeToUser = await userRepository.findOne({
		where: { _id: Number(subscribeToId) },
		relations: ['subscribers'],
	})

	if (!subscribeToUser) {
		throw new ApiError({
			message: 'User not found',
			errorCode: 404,
		})
	}

	if (Number(subscribeToId) === Number(currentUserId)) {
		throw new ApiError({
			message: 'You cannot subscribe to yourself',
			errorCode: 400,
		})
	}

	const isSubscribed = subscribeToUser.subscribers?.some(
		user => user._id === Number(currentUserId)
	)

	if (isSubscribed) {
		subscribeToUser.subscribers = subscribeToUser.subscribers.filter(
			subscriber => subscriber._id !== Number(currentUserId)
		)
		message = 'Unsubscribed successfully'
	} else {
		const subscriber = await userRepository.findOneBy({
			_id: Number(currentUserId),
		})
		if (subscriber) {
			subscribeToUser.subscribers.push(subscriber)
		}
		message = 'Subscribed successfully'
	}
	await userRepository.save(subscribeToUser)
	return message
}
