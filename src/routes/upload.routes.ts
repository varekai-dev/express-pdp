import express from 'express'
import { uploadToS3Handler } from '../controller/upload.controller'
import multer from 'multer'

export const uploadRouter = express.Router()

const upload = multer({ storage: multer.memoryStorage() })

uploadRouter.post('/', upload.single('image'), uploadToS3Handler)
