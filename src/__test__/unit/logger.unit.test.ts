import { logger } from '../../utils/logger'

describe('logger', () => {
	it('should log a message', () => {
		const spy = jest.spyOn(logger, 'info').mockImplementation()

		logger.info('Test message')

		expect(spy).toHaveBeenCalledWith('Test message')

		spy.mockRestore()
	})
})
