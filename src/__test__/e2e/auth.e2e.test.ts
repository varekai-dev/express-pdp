import request from 'supertest'
import { app } from '../../server'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { faker } from '@faker-js/faker'

let mongoServer: MongoMemoryServer

const fakeUser = {
	username: faker.internet.userName(),
	email: faker.internet.email(),
	password: faker.internet.password(8),
}

describe('Auth API', () => {
	beforeAll(async () => {
		mongoServer = new MongoMemoryServer()
		await mongoServer.start()
		const mongoUri = mongoServer.getUri()
		await mongoose.connect(mongoUri)
	})
	afterAll(async () => {
		await mongoose.disconnect()
		await mongoServer.stop()
	})
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
})
