import { typeOrm } from '../config/typeorm'
import { User } from '../entities/user.entity'

export const userRepository = typeOrm.getRepository(User)
