import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongoServer: MongoMemoryServer

export async function setupMongoServer() {
	try {
		mongoServer = new MongoMemoryServer({
			instance: {
				dbName: 'jest',
			},
		})
		await mongoServer.start()
		const mongoUri = mongoServer.getUri()
		await mongoose.connect(mongoUri)
	} catch (e) {
		console.error('setupMongoServer', e)
	}
}

export async function teardownMongoServer() {
	try {
		await mongoose.disconnect()
		await mongoServer.stop()
	} catch (e) {
		console.error('teardownMongoServer', e)
	}
}

export async function clearDatabase() {
	try {
		const collections = mongoose.connection.collections
		for (const key in collections) {
			const collection = collections[key]
			await collection.deleteMany({})
		}
	} catch (e) {
		console.error('clearDatabase', e)
	}
}
