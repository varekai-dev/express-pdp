declare namespace Express {
	export interface Request {
		user: {
			displayName: string
			emails: {
				value: string
			}[]
		}
	}
	export interface Response {
		user: {
			displayName: string
			emails: {
				value: string
			}[]
		}
	}
}
