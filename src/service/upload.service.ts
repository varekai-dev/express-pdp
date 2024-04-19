import { s3Client } from '../config/aws'
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import logger from '../utils/logger'
import dotenv from 'dotenv'
import { createS3Url } from '../utils/createS3Url'
import AWS from 'aws-sdk'

dotenv.config()

const s3 = new AWS.S3()

export async function uploadToS3Handler(file: Express.Multer.File) {
	if (!file) {
		logger.error('No file uploaded')
		throw new Error('No file uploaded')
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
		throw new Error('Error deleting file from S3')
	}
}

export function getS3DownloadUrl(imageUrl: string) {
	const imageName = imageUrl.split('.com/')[1]

	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: imageName,
		Expires: 60 * 60, // URL expires in 1 hour
	}
	const downloadUrl = s3.getSignedUrl('getObject', params)
	return downloadUrl
}
