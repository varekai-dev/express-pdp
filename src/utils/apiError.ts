interface ApiErrorProps {
	message: string
	errorCode: number
}

export class ApiError extends Error {
	errorCode: number
	constructor({ message, errorCode }: ApiErrorProps) {
		super(message)
		this.errorCode = errorCode
	}
}
