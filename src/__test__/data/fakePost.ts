import { faker } from '@faker-js/faker'

export const fakePost = {
	title: faker.lorem.words(3),
	content: faker.lorem.paragraphs(3),
	file: {
		originalname: 'test.jpg',
		mimetype: 'image/jpeg',
		buffer: Buffer.from(new ArrayBuffer(1024)), // Mock 1KB JPEG image
	},
}
