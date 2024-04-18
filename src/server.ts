import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { mongoConnect } from './utils/mongo'
import { api } from './api'
import logger from './utils/logger'
import loggerMiddleware from './middleware/logger.middleware'

dotenv.config()
const app = express()

const PORT = process.env.PORT || 8000

app.use(loggerMiddleware)
app.use(
	cors({
		origin: process.env.FRONTEND_URI,
	})
)
app.use(express.json())

app.use('/api/v1', api)

async function startServer() {
	await mongoConnect()

	app.listen(PORT, () => {
		logger.info(`Server is running on port ${PORT}`)
	})
}

startServer()
