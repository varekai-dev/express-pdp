import { app } from '../../server'
import { createFakeUser } from '../utils/createFakeUser'

import request from 'supertest'

describe('Users API', () => {
	it('should return information about current user', async () => {
		try {
			const { accessToken, username, email } = await createFakeUser()
			const response = await request(app)
				.get('/api/v1/users/me')
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(200)

			expect(response.body).toMatchObject({
				username,
				email,
			})
		} catch (error) {
			console.log(error)
		}
	})

	it('should return information about user by id', async () => {
		try {
			const { accessToken, username, email, _id } = await createFakeUser()
			const response = await request(app)
				.get(`/api/v1/users/${_id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(200)

			expect(response.body).toMatchObject({
				username,
				email,
			})
		} catch (error) {
			console.log(error)
		}
	})

	it('should subscribe to user', async () => {
		try {
			const { accessToken } = await createFakeUser()
			const { _id } = await createFakeUser()

			const response = await request(app)
				.patch(`/api/v1/users/${_id}/subscribe`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(200)

			expect(response.body).toMatchObject({
				message: 'Subscribed successfully',
			})
		} catch (error) {
			console.log(error)
		}
	})

	it('should unsubscribe from user', async () => {
		try {
			const { accessToken } = await createFakeUser()
			const { _id } = await createFakeUser()

			await request(app)
				.patch(`/api/v1/users/${_id}/subscribe`)
				.set('Authorization', `Bearer ${accessToken}`)

			const response = await request(app)
				.patch(`/api/v1/users/${_id}/subscribe`)
				.set('Authorization', `Bearer ${accessToken}`)

			expect(response.body).toMatchObject({
				message: 'Unsubscribed successfully',
			})
		} catch (error) {
			console.log(error)
		}
	})

	it('should throw error when trying to subscribe to yourself', async () => {
		try {
			const { accessToken, _id } = await createFakeUser()

			const response = await request(app)
				.patch(`/api/v1/users/${_id}/subscribe`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(400)

			expect(response.body).toMatchObject({
				errorMessage: 'You cannot subscribe to yourself',
			})
		} catch (error) {
			console.log(error)
		}
	})
})
