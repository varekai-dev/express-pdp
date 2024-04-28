import { faker } from '@faker-js/faker'

export function generateFakePostData() {
	return {
		title: faker.lorem.word(),
		content: faker.lorem.word(4),
	}
}
