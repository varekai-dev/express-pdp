import request from 'supertest'
import {
	setupMongoServer,
	teardownMongoServer,
} from '../utils/setupMongoServer'
import { app } from '../../server'
import { faker } from '@faker-js/faker'
import { getAuthToken } from '../utils/getAuthToken'
import * as uploadService from '../../service/upload.service'
import { MAX_FILE_SIZE_MB } from '../../constants/maxSize'

let token: string

const fakeImageUrl = faker.image.url()
let fakePost = {
	title: faker.lorem.words(3),
	content: faker.lorem.paragraphs(3),
	file: {
		originalname: 'test.jpg',
		mimetype: 'image/jpeg',
		buffer: Buffer.from(new ArrayBuffer(1024)), // Mock 1KB JPEG image
	},
	_id: undefined,
}

describe('Posts API', () => {
	let uploadToS3Spy: jest.SpyInstance
	let getS3DownloadUrlSpy: jest.SpyInstance
	beforeAll(async () => {
		setupMongoServer()
		token = await getAuthToken()
		uploadToS3Spy = jest
			.spyOn(uploadService, 'uploadToS3Handler')
			.mockResolvedValue(fakeImageUrl)
		getS3DownloadUrlSpy = jest
			.spyOn(uploadService, 'getS3DownloadUrl')
			.mockReturnValue(fakeImageUrl)
	})
	afterAll(() => {
		teardownMongoServer()
		uploadToS3Spy.mockRestore()
		getS3DownloadUrlSpy.mockRestore()
	})
	it('should create new post', async () => {
		const response = await request(app)
			.post('/api/v1/posts')
			.set('Authorization', `Bearer ${token}`)
			.field('title', fakePost.title)
			.field('content', fakePost.content)
			.attach('file', fakePost.file.buffer, {
				filename: fakePost.file.originalname,
				contentType: fakePost.file.mimetype,
			})
			.expect(201)

		fakePost._id = response.body._id

		expect(response.body).toMatchObject({
			title: fakePost.title,
			content: fakePost.content,
			imageUrl: fakeImageUrl,
		})
	})

	it('should throw validation errors', async () => {
		const errors = [
			'Title should be at least 1 character long',
			'Content should be at least 4 characters long',
			'File should be an image',
			`File size should be less than ${MAX_FILE_SIZE_MB}MB`,
		]

		const notAllowedFile = Buffer.from(
			new ArrayBuffer(MAX_FILE_SIZE_MB * 1024 * 1024 * 2)
		)
		const response = await request(app)
			.post('/api/v1/posts')
			.set('Authorization', `Bearer ${token}`)
			.field('title', '')
			.field('content', faker.string.alphanumeric(3))
			.attach('file', notAllowedFile, {
				filename: fakePost.file.originalname,
				contentType: 'plain/text',
			})
			.expect(400)

		const responseErrors = response.body.map(
			({ message }: { message: string }) => message
		)
		expect(responseErrors).toEqual(errors)
	})

	it('should render the post template with the post data', async () => {
		const response = await request(app)
			.get(`/api/v1/posts/${fakePost._id}/render`)
			.expect(200)

		expect(response.text).toContain(fakePost.title)
		expect(response.text).toContain(fakePost.content)
	})

	it('should download the post file', async () => {
		const response = await request(app)
			.get(`/api/v1/posts/${fakePost._id}/download`)
			.expect(302)

		expect(response.header.location).toBe(fakeImageUrl)
	})

	it('should get all posts', async () => {
		const response = await request(app)
			.get('/api/v1/posts')
			.set('Authorization', `Bearer ${token}`)
			.expect(200)

		expect(response.body).toHaveLength(1)
		expect(response.body[0]).toMatchObject({
			title: fakePost.title,
			content: fakePost.content,
			imageUrl: fakeImageUrl,
		})
	})

	it('should get post by id', async () => {
		const response = await request(app)
			.get(`/api/v1/posts/${fakePost._id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)

		expect(response.body).toMatchObject({
			title: fakePost.title,
			content: fakePost.content,
			imageUrl: fakeImageUrl,
		})
	})

	it('should update post', async () => {
		const updatedPost = {
			title: faker.lorem.words(3),
			content: faker.lorem.paragraphs(3),
		}

		const response = await request(app)
			.patch(`/api/v1/posts/${fakePost._id}`)
			.set('Authorization', `Bearer ${token}`)
			.field('title', updatedPost.title)
			.field('content', updatedPost.content)
			.expect(200)

		expect(response.body).toMatchObject({
			title: updatedPost.title,
			content: updatedPost.content,
			imageUrl: fakeImageUrl,
		})
	})

	it('should delete post', async () => {
		await request(app)
			.delete(`/api/v1/posts/${fakePost._id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(204)

		const response = await request(app)
			.get('/api/v1/posts')
			.set('Authorization', `Bearer ${token}`)
			.expect(200)

		expect(response.body).toHaveLength(0)
	})
})
