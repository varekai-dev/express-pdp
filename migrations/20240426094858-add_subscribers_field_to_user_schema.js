module.exports = {
	async up(db, client) {
		await db.collection('users').updateMany({}, { $set: { subscribers: [] } })
	},

	async down(db, client) {
		await db.collection('users').updateMany({}, { $unset: { subscribers: '' } })
	},
}
