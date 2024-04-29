import { faker } from '@faker-js/faker'

export const fakeUser = {
	username: faker.internet.userName().substring(0, 8),
	email: faker.internet.email({
		provider: 'gmail.com',
	}),
	password: faker.internet.password({
		length: 8,
	}),
}
