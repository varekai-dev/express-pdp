import FormData from 'form-data'
// import mockFs from 'mock-fs'
import fs from 'fs'
import { generateFakePostData } from './generateFakePostData'
import path from 'path'

// Create a mock file system
// mockFs({
// 	'path/to': {
// 		'test.jpg': Buffer.from([8, 6, 7, 5, 3, 0, 9]), // this represents binary data of a file
// 	},
// })
// Now 'path/to/test.jpg' exists and can be read
// const file = fs.createReadStream('path/to/test.jpg')

export function createMockedPost() {
	const fakePostData = generateFakePostData()
	const post = new FormData()
	post.append('title', fakePostData.title)
	post.append('content', fakePostData.content)
	const filePath = path.join(__dirname, 'img', 'image.jpeg')
	const file = fs.createReadStream(filePath)
	post.append('file', file, 'image.jpeg')
	return post
}
