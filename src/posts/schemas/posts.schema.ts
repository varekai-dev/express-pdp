import mongoose from 'mongoose'

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

const postsModel = mongoose.model('Post', postsSchema)

export default postsModel
