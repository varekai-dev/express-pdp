import { Server } from 'http'
import { Server as SocketServer, Socket } from 'socket.io'

import { getUserIdFromSocket } from '../utils/getUserIdFromSocket'
import { initializeSocket } from '../config/sockets'

jest.mock('socket.io')
jest.mock('../utils/getUserIdFromSocket')

describe('initializeSocket', () => {
	it('should initialize the socket server', () => {
		const mockServer = {} as Server
		const mockSocketServer = {
			use: jest.fn(),
			on: jest.fn(),
		}
		const mockSocket = {} as Socket

		;(SocketServer as unknown as jest.Mock).mockImplementation(
			() => mockSocketServer
		)
		;(getUserIdFromSocket as jest.Mock).mockReturnValue('test-room-id')

		const io = initializeSocket(mockServer)

		expect(SocketServer).toHaveBeenCalledWith(mockServer, {
			cors: {
				origin: process.env.FRONTEND_URI,
				methods: ['GET', 'POST'],
			},
		})
		expect(io).toBe(mockSocketServer)
		expect(mockSocketServer.use).toHaveBeenCalledWith(expect.any(Function))
		expect(mockSocketServer.on).toHaveBeenCalledWith(
			'connect',
			expect.any(Function)
		)

		const middleware = mockSocketServer.use.mock.calls[0][0]
		const next = jest.fn()
		middleware(mockSocket, next)
		expect(getUserIdFromSocket).toHaveBeenCalledWith(mockSocket)
		expect(next).toHaveBeenCalled()

		const connectHandler = mockSocketServer.on.mock.calls[0][1]
		const mockJoin = jest.fn()
		const mockOn = jest.fn()
		mockSocket.join = mockJoin
		mockSocket.on = mockOn
		connectHandler(mockSocket)
		expect(mockJoin).toHaveBeenCalledWith('test-room-id')
		expect(mockOn).toHaveBeenCalledWith('disconnect', expect.any(Function))
	})
})
