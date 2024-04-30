import {
	deleteFromS3Handler,
	getS3DownloadUrl,
	uploadToS3Handler,
} from '../service/upload.service'
import { ApiError } from '../utils/apiError'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { createS3Url } from '../utils/createS3Url'
import { faker } from '@faker-js/faker'
import { s3Client } from '../config/aws'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

jest.mock('@aws-sdk/client-s3')
jest.mock('@aws-sdk/s3-request-presigner')
jest.mock('../utils/logger')
jest.mock('../config/aws')
jest.mock('../utils/createS3Url')

const fakeLink = faker.internet.url()

const mockSend = jest.fn()

s3Client.send = mockSend
;(createS3Url as jest.Mock).mockReturnValue(fakeLink)

const file = {
	originalname: 'test232.jpg',
	buffer: Buffer.from('test'),
} as Express.Multer.File

describe('uploadService', () => {
	afterAll(() => {
		jest.clearAllMocks()
	})
	describe('uploadToS3Handler', () => {
		it('should upload the file to S3 and return the S3 URL', async () => {
			const result = await uploadToS3Handler(file)
			expect(result).toBe(fakeLink)
		})

		it('should throw an ApiError if no file is uploaded', async () => {
			try {
				await uploadToS3Handler()
			} catch (error) {
				expect(error).toBeInstanceOf(ApiError)
				expect((error as ApiError).message).toBe('No file uploaded')
			}
		})
	})
	describe('deleteFromS3Handler', () => {
		it('should delete the file from S3', async () => {
			const mockImageName = 'test-image.jpg'
			const mockS3Client = { send: jest.fn() }
			const mockDeleteObjectCommand = jest.fn()

			;(S3Client as jest.Mock).mockImplementation(() => mockS3Client)
			;(DeleteObjectCommand as unknown as jest.Mock).mockImplementation(
				() => mockDeleteObjectCommand
			)

			await deleteFromS3Handler(mockImageName)

			expect(DeleteObjectCommand).toHaveBeenCalledWith({
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: mockImageName,
			})
		})
	})
	describe('getS3DownloadUrl', () => {
		it('should return the S3 download URL', async () => {
			const mockImageUrl =
				'https://test-bucket.s3.amazonaws.com/test-image2.jpg'

			const mockDownloadUrl =
				'https://test-bucket.s3.amazonaws.com/test-image.jpg?AWSAccessKeyId=AKIAIOSFODNN7EXAMPLE&Expires=1316284397&Signature=vjbyPxybdZaNmGa%2ByT272YEAiv4%3D'

			;(S3Client as jest.Mock).mockImplementation(() => ({
				send: jest.fn(),
			}))
			;(getSignedUrl as jest.Mock).mockResolvedValue(mockDownloadUrl)

			const result = await getS3DownloadUrl(mockImageUrl)

			expect(result).toBe(mockDownloadUrl)
		})
	})
})
