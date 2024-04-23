import mongoose from 'mongoose'
import { UserDocument } from './user.model'

export interface PostDocument extends Document {
	_id: mongoose.Types.ObjectId
	title: string
	content: string
	imageUrl: string
	createdBy: UserDocument
	createdAt: Date
	updatedAt: Date
}

const postsSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		content: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

const postsModel = mongoose.model<PostDocument>('Post', postsSchema)

export default postsModel
