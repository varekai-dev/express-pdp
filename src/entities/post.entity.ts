import {
	Column,
	CreateDateColumn,
	Entity,
	OneToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm'
import { User } from './user.entity'

@Entity('Posts')
export class Post {
	@PrimaryColumn()
	_id: number

	@Column({
		nullable: false,
		unique: true,
	})
	title: string

	@Column({
		nullable: false,
	})
	content: string

	@Column({
		nullable: false,
	})
	imageUrl: string

	@OneToOne(() => User, user => user._id, { cascade: true })
	createdBy: number

	@CreateDateColumn()
	createdDate: Date

	@UpdateDateColumn()
	updatedDate: Date
}
