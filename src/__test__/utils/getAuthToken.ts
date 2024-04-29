import request from 'supertest'
import { app } from '../../server'
import { fakeUser } from '../data/fakeUser'

export async function getAuthToken() {
	await request(app).post('/api/v1/auth/register').send(fakeUser)
	const response = await request(app).post('/api/v1/auth/login').send({
		email: fakeUser.email,
		password: fakeUser.password,
	})

	return response.body.accessToken
}
