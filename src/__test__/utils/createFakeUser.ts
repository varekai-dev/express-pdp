import { faker } from '@faker-js/faker'
import request from 'supertest'
import { app } from '../../server'

export async function createFakeUser() {
	try {
		const fakeUser = {
			username: faker.internet.userName().substring(0, 8),
			email: faker.internet.email(),
			password: faker.internet.password({
				length: 8,
			}),
		}
		const userResponse = await request(app)
			.post('/api/v1/auth/register')
			.send(fakeUser)

		if (userResponse) {
			return {
				...userResponse?.body,
				password: fakeUser.password,
			}
		}
	} catch (error) {
		console.error('createFakeUser', error)
	}
}
