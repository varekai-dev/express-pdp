import jsonwebtoken, { JwtPayload } from 'jsonwebtoken'
import { Socket } from 'socket.io'

export function getUserIdFromSocket(socket: Socket) {
	const bearer = socket.handshake.headers.authorization
	const token = bearer?.split(' ')[1] || ''
	if (!token) {
		return
	}

	const decoded = jsonwebtoken.verify(
		token,
		String(process.env.JWT_SECRET)
	) as JwtPayload
	return String(decoded.userId)
}
