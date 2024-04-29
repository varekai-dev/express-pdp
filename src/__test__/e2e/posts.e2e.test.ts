import request from 'supertest'
import { app } from '../../server'
import { faker } from '@faker-js/faker'
import * as uploadService from '../../service/upload.service'
import { MAX_FILE_SIZE_MB } from '../../constants/maxSize'
import { createFakeUser } from '../utils/createFakeUser'
import { fakePost } from '../data/fakePost'
import { createFakePost } from '../utils/createFakePost'
import {
	clearMongoServerDb,
	setupMongoServer,
	teardownMongoServer,
} from '../utils/setupMongoServer'

const fakeImageUrl = 'https://test-bucket.s3.amazonaws.com/test.jpg'
let accessToken: string

describe('Posts API', () => {
	let uploadToS3Spy: jest.SpyInstance
	let getS3DownloadUrlSpy: jest.SpyInstance
	beforeAll(() => {
		setupMongoServer()
		uploadToS3Spy = jest
			.spyOn(uploadService, 'uploadToS3Handler')
			.mockResolvedValue('https://test-bucket.s3.amazonaws.com/test.jpg')

		getS3DownloadUrlSpy = jest
			.spyOn(uploadService, 'getS3DownloadUrl')
			.mockResolvedValue(fakeImageUrl)
	})
	afterEach(clearMongoServerDb)
	beforeEach(async () => {
		const fakeUser = await createFakeUser()
		accessToken = fakeUser.accessToken
	})
	afterAll(() => {
		teardownMongoServer()
		uploadToS3Spy.mockRestore()
		getS3DownloadUrlSpy.mockRestore()
	})
	it('should create new post', async () => {
		const { requestData, responseData } =
			(await createFakePost(accessToken)) || {}

		expect(responseData).toMatchObject({
			title: requestData?.title,
			content: requestData?.content,
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
			.set('Authorization', `Bearer ${accessToken}`)
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
		const { responseData } = (await createFakePost(accessToken)) || {}
		const response = await request(app)
			.get(`/api/v1/posts/${responseData._id}/render`)
			.expect(200)

		expect(response.text).toContain(responseData.title)
		expect(response.text).toContain(responseData.content)
	})

	it('should download the post file', async () => {
		const { responseData } = (await createFakePost(accessToken)) || {}
		const response = await request(app)
			.get(`/api/v1/posts/${responseData._id}/download`)
			.expect(302)

		expect(response.header.location).toBe(fakeImageUrl)
	})

	it('should get all posts', async () => {
		const { responseData } = (await createFakePost(accessToken)) || {}
		const response = await request(app)
			.get('/api/v1/posts')
			.set('Authorization', `Bearer ${accessToken}`)
			.expect(200)

		const lastPost = response.body[response.body.length - 1]

		expect(lastPost).toMatchObject({
			title: responseData.title,
			content: responseData.content,
		})
	})

	it('should get post by id', async () => {
		const { responseData } = await createFakePost(accessToken)
		const response = await request(app)
			.get(`/api/v1/posts/${responseData._id}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.expect(200)

		expect(response.body).toMatchObject({
			title: responseData.title,
			content: responseData.content,
		})
	})

	it('should update post', async () => {
		const updatedPost = {
			title: faker.lorem.words(3),
			content: faker.lorem.paragraphs(3),
		}
		const { responseData } = await createFakePost(accessToken)
		const response = await request(app)
			.patch(`/api/v1/posts/${responseData._id}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.field('title', updatedPost.title)
			.field('content', updatedPost.content)
			.expect(200)

		expect(response.body).toMatchObject({
			title: updatedPost.title,
			content: updatedPost.content,
		})
	})

	it('should delete post', async () => {
		const { responseData } = await createFakePost(accessToken)
		await request(app)
			.delete(`/api/v1/posts/${responseData._id}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.expect(204)

		await request(app)
			.get(`/api/v1/posts/${responseData._id}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.expect(404)
	})
})
