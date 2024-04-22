import express from 'express'
import * as authController from '../controller/auth.controller'
import passport from 'passport'
import { validateResource } from '../middleware/validate-resource.middleware'
import { createUserSchema } from '../schemas/user.schema'

export const authRouter = express.Router()

const FRONTEND_URI = process.env.FRONTEND_URI

authRouter.post('/login', authController.httpPostLoginHandler)
authRouter.post(
	'/register',
	validateResource(createUserSchema),
	authController.httpPostRegisterHandler
)
authRouter.get(
	'/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
		session: false,
	})
)
authRouter.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: `${FRONTEND_URI}/login?status=failure`,
		session: false,
	}),
	authController.httpGoogleAuthHandler
)
