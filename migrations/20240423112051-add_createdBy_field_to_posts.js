const { Types } = require('mongoose')

const userId = '662641285f38f3d3ba738c46'

module.exports = {
	async up(db, client) {
		await db.collection('posts').updateMany(
			{
				createdBy: { $exists: false },
			},
			{
				$set: {
					createdBy: new Types.ObjectId(userId),
				},
			}
		)
	},

	async down(db, client) {
		await db.collection('posts').updateMany(
			{},
			{
				$set: {
					createdBy: undefined,
				},
			}
		)
	},
}
