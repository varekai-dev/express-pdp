import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import type {
	Profile,
	VerifyCallback,
	StrategyOptions,
} from 'passport-google-oauth20'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import userModel from '../models/user.model'
import { Types } from 'mongoose'
import type { StrategyOptionsWithoutRequest } from 'passport-jwt'

import dotenv from 'dotenv'
import { userRepository } from '../repository/user.repository'

dotenv.config()

const DATABASE_TYPE = process.env.DATABASE_TYPE

const AUTH_GOOGLE_OPTIONS = {
	callbackURL: '/api/v1/auth/google/callback',
	clientID: String(process.env.GOOGLE_CLIENT_ID),
	clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
} satisfies StrategyOptions

async function verifyCallback(
	accessToken: string,
	refreshToken: string,
	profile: Profile,
	cb: VerifyCallback
) {
	cb(null, profile)
}

const JWT_OPTIONS = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: String(process.env.JWT_SECRET),
} satisfies StrategyOptionsWithoutRequest

passport.use(
	new JwtStrategy(JWT_OPTIONS, async function (payload, done) {
		try {
			let user
			if (DATABASE_TYPE === 'mongodb') {
				user = await userModel.findById(new Types.ObjectId(payload.userId))
			} else {
				user = await userRepository.findOneBy({ _id: +payload.userId })
			}
			if (!user) {
				return done(null, false)
			}

			done(null, {
				userId: user._id,
			})
		} catch (error) {
			done(error, false)
		}
	})
)

passport.use(new GoogleStrategy(AUTH_GOOGLE_OPTIONS, verifyCallback))
