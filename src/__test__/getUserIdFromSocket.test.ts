import { getUserIdFromSocket } from '../utils/getUserIdFromSocket'
import * as jsonwebtoken from 'jsonwebtoken'
import { Socket } from 'socket.io'

jest.mock('jsonwebtoken')

describe('getUserIdFromSocket', () => {
	it('should return the user ID from the socket', () => {
		const mockUserId = 'test-user-id'
		const mockToken = 'test-token'
		const mockSocket = {
			handshake: {
				headers: {
					authorization: `Bearer ${mockToken}`,
				},
			},
		} as unknown as Socket

		;(jsonwebtoken.verify as jest.Mock).mockReturnValue({ userId: mockUserId })

		const result = getUserIdFromSocket(mockSocket)

		expect(result).toBe(mockUserId)
		expect(jsonwebtoken.verify).toHaveBeenCalledWith(
			mockToken,
			String(process.env.JWT_SECRET)
		)
	})

	it('should return undefined if the authorization header is missing', () => {
		const mockSocket = {
			handshake: {
				headers: {},
			},
		} as unknown as Socket

		const result = getUserIdFromSocket(mockSocket)

		expect(result).toBeUndefined()
	})
})
