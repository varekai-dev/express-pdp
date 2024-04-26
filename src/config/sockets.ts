import { Server as SocketServer } from 'socket.io'
import { getUserIdFromSocket } from '../utils/getUserIdFromSocket'
import { Server } from 'http'

export function initializeSocket(server: Server) {
	const io = new SocketServer(server, {
		cors: {
			origin: process.env.FRONTEND_URI,
			methods: ['GET', 'POST'],
		},
	})

	io.use((socket, next) => {
		if (getUserIdFromSocket(socket)) {
			return next()
		}
		return next(new Error('authentication error'))
	})

	io.on('connect', socket => {
		const roomId = getUserIdFromSocket(socket)
		socket.join(roomId)
		socket.on('disconnect', () => {
			socket.leave(roomId)
			console.log('a user disconnected')
		})
	})
	return io
}
