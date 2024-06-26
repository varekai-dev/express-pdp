import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import http from 'http'
import { mongoConnect } from './config/mongo'
import { api } from './api'
import { logger } from './utils/logger'
import loggerMiddleware from './middleware/logger.middleware'
import path from 'path'
import './config/passport'
import { initializeSocket } from './config/sockets'
import 'reflect-metadata'
import { typeOrm } from './config/typeorm'

const PORT = process.env.PORT || 8000

dotenv.config()

export const app = express()

export const server = http.createServer(app)

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '..', 'templates'))

app.use(loggerMiddleware)
app.use(
	cors({
		origin: process.env.FRONTEND_URI,
	})
)
app.use(express.json())
app.use('/api/v1', api)

if (process.env.NODE_ENV !== 'test') {
	server.listen(PORT, async () => {
		logger.info(`Server is running on port ${PORT}`)
		if (process.env.DATABASE_TYPE === 'mongodb') {
			await mongoConnect()
			logger.info('Mongo connected')
		}
		if (process.env.DATABASE_TYPE === 'postgres') {
			await typeOrm.initialize()
			logger.info('Postgres connected')
		}
	})
}

export const sockets = initializeSocket(server)
