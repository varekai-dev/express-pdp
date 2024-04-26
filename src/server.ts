import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import http from 'http'
import { mongoConnect } from './config/mongo'
import { api } from './api'
import logger from './utils/logger'
import loggerMiddleware from './middleware/logger.middleware'
import path from 'path'
import './config/passport'
import './sockets'
import { Server as SocketServer } from 'socket.io'
import * as sockets from './sockets'

const PORT = process.env.PORT || 8000

dotenv.config()

const app = express()

const server = http.createServer(app)

const io = new SocketServer(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
})

sockets.listen(io)

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

async function startServer() {
	await mongoConnect()

	app.listen(PORT, () => {
		logger.info(`Server is running on port ${PORT}`)
	})
}

startServer()
