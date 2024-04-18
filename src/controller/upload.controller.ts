import { Request, Response } from 'express'
import { s3Client } from '../config/aws'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import logger from '../utils/logger'
import dotenv from 'dotenv'

dotenv.config()

export async function uploadToS3Handler(req: Request, res: Response) {
	const file = req.file

	if (!file) {
		logger.error('No file uploaded')
		res.status(400).send({
			error: 'No file uploaded',
		})
		return
	}
	// Upload file to S3
	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: file.originalname,
		Body: file.buffer,
	}

	try {
		await s3Client.send(new PutObjectCommand(params))
		res.send({
			status: 'success',
		})
	} catch (err) {
		logger.error(err)
		res.status(500).send({ error: 'Error uploading file to S3' })
	}
}
