import { typeOrm } from '../config/typeorm'
import { Post } from '../entities/post.entity'

export const postRepository = typeOrm.getRepository(Post)
