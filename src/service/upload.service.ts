import { s3Client } from '../config/aws'
import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
} from '@aws-sdk/client-s3'
import logger from '../utils/logger'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import dotenv from 'dotenv'
import { createS3Url } from '../utils/createS3Url'

import { ApiError } from '../utils/apiError'

dotenv.config()

export async function uploadToS3Handler(file: Express.Multer.File) {
	if (!file) {
		logger.error('No file uploaded')
		throw new ApiError({
			message: 'No file uploaded',
			errorCode: 400,
		})
	}
	// Upload file to S3
	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: file.originalname,
		Body: file.buffer,
		ACL: 'public-read',
	}

	try {
		//@ts-ignore
		await s3Client.send(new PutObjectCommand(params))

		return createS3Url(file)
	} catch (err) {
		logger.error(err)
	}
}

export async function deleteFromS3Handler(imageName: string) {
	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: imageName,
	}

	try {
		await s3Client.send(new DeleteObjectCommand(params))
	} catch (err) {
		logger.error(err)
		throw new ApiError({
			message: 'Failed to delete image from S3',
			errorCode: 500,
		})
	}
}

export async function getS3DownloadUrl(imageUrl: string) {
	const imageName = imageUrl.split('.com/')[1]

	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: imageName,
		Expires: 60 * 60, // URL expires in 1 hour
	}
	const downloadUrl = await getSignedUrl(s3Client, new GetObjectCommand(params))
	return downloadUrl
}
