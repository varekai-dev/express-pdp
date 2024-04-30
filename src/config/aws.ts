import dotenv from 'dotenv'
import { S3Client } from '@aws-sdk/client-s3'

dotenv.config()

// Create an S3 client
export const s3Client = new S3Client({
	region: String(process.env.AWS_REGION),
	credentials: {
		accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
		secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
	},
})

console.log('s3Client', s3Client)
