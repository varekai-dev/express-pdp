declare namespace Express {
	export interface Request {
		user?: {
			userId?: string
			displayName?: string
			emails?: {
				value: string
			}[]
		}
	}
}
