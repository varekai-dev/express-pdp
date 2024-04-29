import { faker } from '@faker-js/faker'

export const fakeUser = {
	username: faker.internet.userName(),
	email: faker.internet.email({
		provider: 'gmail.com',
	}),
	password: faker.internet.password({
		length: 8,
	}),
}
