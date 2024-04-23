import mongoose from 'mongoose'
import { AuthType } from '../enums/auth-type.enum'
// import bcrypt from 'bcrypt'

export interface UserDocument extends Document {
	_id: mongoose.Types.ObjectId
	username: string
	email: string
	createdAt: Date
	updatedAt: Date
}

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		authType: {
			type: String,
			enum: Object.values(AuthType),
			default: AuthType.Local,
		},
	},
	{
		timestamps: true,
	}
)

// userSchema.pre('save', async function (next) {
// 	if (this.isModified('password')) {
// 		const salt = await bcrypt.genSalt(10)
// 		this.password = await bcrypt.hash(this.password, salt)
// 	}
// 	next()
// })

const userModel = mongoose.model('User', userSchema)

export default userModel
