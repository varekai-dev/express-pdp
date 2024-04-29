import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongoServer: MongoMemoryServer

export async function setupMongoServer() {
	mongoServer = new MongoMemoryServer()
	await mongoServer.start()
	const mongoUri = mongoServer.getUri()
	await mongoose.connect(mongoUri)
}

export async function teardownMongoServer() {
	await mongoose.disconnect()
	await mongoServer.stop()
}
