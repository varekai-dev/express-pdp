import jwt from 'jsonwebtoken'

export function generateJwtToken(userId: string, expiresIn: number) {
	return jwt.sign({ userId }, String(process.env.JWT_SECRET), {
		expiresIn: expiresIn,
	})
}
