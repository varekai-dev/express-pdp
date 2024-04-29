import pinoLogger from 'pino'
import dayjs from 'dayjs'

export const logger = pinoLogger({
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
		},
	},
	base: {
		pid: false,
	},
	timestamp: () => `,"time":"${dayjs().format('DD/MM/YYYY HH:mm:ss')}"`,
})
