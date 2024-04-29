import request from 'supertest'
import { app } from '../../server'
import { faker } from '@faker-js/faker'
import {
	setupMongoServer,
	teardownMongoServer,
} from '../utils/setupMongoServer'

const fakeUser = {
	username: faker.internet.userName(),
	email: faker.internet.email({
		provider: 'gmail.com',
	}),
	password: faker.internet.password({
		length: 8,
	}),
}

describe('Auth API', () => {
	beforeAll(setupMongoServer)
	afterAll(teardownMongoServer)
	it('should register new user', async () => {
		const response = await request(app)
			.post('/api/v1/auth/register')
			.send(fakeUser)
			.expect(200)

		expect(response.body).toMatchObject({
			username: fakeUser.username,
			email: fakeUser.email,
			subscribers: [],
		})
	})
	it('should login user and return tokens', async () => {
		const response = await request(app)
			.post('/api/v1/auth/login')
			.send({
				email: fakeUser.email,
				password: fakeUser.password,
			})
			.expect(200)

		expect(response.body).toMatchObject({
			accessToken: expect.any(String),
			refreshToken: expect.any(String),
		})
	})

	it('should return 404 if password or email is wrong', async () => {
		const response = await request(app)
			.post('/api/v1/auth/login')
			.send({
				email: faker.internet.email(),
				password: faker.internet.password(8),
			})
			.expect(400)
		expect(response.body).toMatchObject({
			errorMessage: 'Email or password is wrong',
		})
	})

	it('should return validation errors', async () => {
		const errors = [
			'Invalid email',
			'Password must be at least 8 characters',
			'Username must be at least 4 characters',
		]
		const response = await request(app)
			.post('/api/v1/auth/register')
			.send({
				email: 'wrongemail.com',
				password: '123',
				username: 't',
			})
			.expect(400)
		const responseErrors = response.body.map(
			({ message }: { message: string }) => message
		)
		expect(errors).toEqual(responseErrors)
	})

	it('should redirect user to login page', async () => {
		const mockUser = {
			displayName: fakeUser.username,
			emails: [{ value: fakeUser.email }],
		}

		const response = await request(app)
			.get('/api/v1/auth/google/callback')
			.set('user', JSON.stringify(mockUser))
			.expect(302)
	})
})
