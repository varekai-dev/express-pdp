import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { mongoConnect } from './services/mongo'
import { api } from './api'

dotenv.config()
const app = express()

const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

app.use('/api/v1', api)

async function startServer() {
	await mongoConnect()

	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`)
	})
}

startServer()
