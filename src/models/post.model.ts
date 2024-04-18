import mongoose from 'mongoose'

export interface PostDocument extends Document {
	title: string
	content: string
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
	},
	{
		timestamps: true,
	}
)

const postsModel = mongoose.model<PostDocument>('Post', postsSchema)

export default postsModel
