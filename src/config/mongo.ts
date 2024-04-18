import mongoose from 'mongoose'
import logger from '../utils/logger'

mongoose.connection.once('open', () => {
	logger.info('MongoDB connected')
})

mongoose.connection.on('error', err => {
	logger.error('MongoDB connection error: ', err)
})

export async function mongoConnect() {
	await mongoose.connect(String(process.env.MONGO_URI))
}

export async function mongoDisconnect() {
	await mongoose.disconnect()
}
