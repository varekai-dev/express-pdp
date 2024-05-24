import { faker } from '@faker-js/faker'
import request from 'supertest'
import { app } from '../../server'

export async function createFakePost(accessToken: string) {
	const fakePost = {
		title: faker.lorem.words(3),
		content: faker.lorem.words(3),
		file: {
			originalname: 'test.jpg',
			mimetype: 'image/jpeg',
			buffer: Buffer.from(new ArrayBuffer(1024)), // Mock 1KB JPEG image
		},
	}

	const response = await request(app)
		.post('/api/v1/posts')
		.set('Authorization', `Bearer ${accessToken}`)
		.field('title', fakePost.title)
		.field('content', fakePost.content)
		.attach('file', fakePost.file.buffer, {
			filename: fakePost.file.originalname,
			contentType: fakePost.file.mimetype,
		})
console.log('response',response)
	return {
		requestData: {
			title: fakePost.title,
			content: fakePost.content,
		},
		responseData: response.body,
	}
}
