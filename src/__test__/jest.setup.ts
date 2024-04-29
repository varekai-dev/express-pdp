import { setupMongoServer, teardownMongoServer } from './utils/setupMongoServer'

beforeAll(setupMongoServer)
afterAll(teardownMongoServer)
