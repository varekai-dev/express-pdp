module.exports = {
	async up(db, client) {
		// TODO write your migration here.
		// See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
		// Example:
		await db.collection('posts').updateMany(
			{},
			{
				$set: {
					imageUrl:
						'https://express-pdp.s3.eu-central-1.amazonaws.com/avatar.jpeg',
				},
			}
		)
	},

	async down(db, client) {
		// TODO write the statements to rollback your migration (if possible)
		// Example:
		await db
			.collection('posts')
			.updateOne({}, { $set: { imageUrl: undefined } })
	},
}
