import { Server } from 'socket.io'

function listen(io: Server) {
	io.on('connection', socket => {
		console.log('a user connected')

		socket.on('disconnect', () => {
			console.log('user disconnected')
		})
	})
}

export { listen }
