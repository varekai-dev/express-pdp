import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

export const typeOrm = new DataSource({
	port: Number(process.env.POSTGRES_PORT) || 5432,
	host: process.env.POSTGRES_HOST,
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	type: 'postgres',
	synchronize: true,
	entities: [path.resolve(__dirname, '../entities/**/*.entity{.ts,.js}')],
	migrations: [path.resolve(__dirname, '../typeorm-migrations/**/*{.ts,.js}')],
	subscribers: [path.resolve(__dirname, '../subscribers/**/*{.ts,.js}')],
})
