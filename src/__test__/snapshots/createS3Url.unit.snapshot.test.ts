import { createS3Url } from '../../utils/createS3Url'

describe('createS3Url', () => {
	it('should return the correct S3 URL', () => {
		const result = createS3Url({
			originalname: 'test.jpg',
		} as Express.Multer.File)

		expect(result).toMatchSnapshot()
	})
})
