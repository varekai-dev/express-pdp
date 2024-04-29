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
		await mongoose.connection.dropDatabase()
		await mongoose.connection.close()
		await mongoServer.stop()
	} catch (e) {
		console.error('teardownMongoServer', e)
	}
}

export async function clearMongoServerDb() {
	const collections = mongoose.connection.collections
	for (const key in collections) {
		const collection = collections[key]
		await collection.deleteMany({})
	}
}
