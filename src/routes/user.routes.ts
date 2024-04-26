import express from 'express'
import {
	getMeHandler,
	getUserHandler,
	pathSubscribeHandler,
} from '../controller/users.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export const usersRouter = express.Router()

usersRouter.get('/me', authMiddleware, getMeHandler)
usersRouter.get('/:id', getUserHandler)
usersRouter.patch('/:id/subscribe', authMiddleware, pathSubscribeHandler)
