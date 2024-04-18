import { config } from 'dotenv'

config()

export function createS3Url(file: Express.Multer.File) {
	return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.originalname}`
}
