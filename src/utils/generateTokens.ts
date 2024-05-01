import { generateJwtToken } from './generateJwtToken'

export function generateTokens(userId: string) {
	const accessToken = generateJwtToken(
		userId,
		Number(process.env.JWT_ACCESS_TOKEN_TTL)
	)
	const refreshToken = generateJwtToken(
		userId,
		Number(process.env.JWT_REFRESH_TOKEN_TTL)
	)
	return { accessToken, refreshToken }
}
