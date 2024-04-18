import mongoose from 'mongoose'

mongoose.connection.once('open', () => {
	console.log('MongoDB connected')
})

mongoose.connection.on('error', err => {
	console.log('MongoDB connection error: ', err)
})

export async function mongoConnect() {
	await mongoose.connect(String(process.env.MONGO_URI))
}

export async function mongoDisconnect() {
	await mongoose.disconnect()
}
