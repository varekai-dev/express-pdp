import mongoose from 'mongoose'
import { logger } from '../utils/logger'
import env from 'dotenv'

env.config()

const MONGO_URL = process.env.MONGO_URI

mongoose.connection.once('open', () => {
	logger.info('MongoDB connected')
})

mongoose.connection.on('error', err => {
	logger.error('MongoDB connection error: ', err)
})

export async function mongoConnect() {
	await mongoose.connect(String(MONGO_URL))
}

export async function mongoDisconnect() {
	await mongoose.disconnect()
}
