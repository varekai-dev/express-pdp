import request from 'supertest'
import { app } from '../../server'
import { faker } from '@faker-js/faker'

const fakeUser = {
	username: faker.internet.userName(),
	email: faker.internet.email({
		provider: 'gmail.com',
	}),
	password: faker.internet.password({
		length: 8,
	}),
}

export async function getAuthToken() {
	await request(app).post('/api/v1/auth/register').send(fakeUser)
	const response = await request(app).post('/api/v1/auth/login').send({
		email: fakeUser.email,
		password: fakeUser.password,
	})

	return response.body.accessToken
}
