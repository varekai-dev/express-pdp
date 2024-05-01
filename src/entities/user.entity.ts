import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

@Entity('User')
export class User {
	@PrimaryGeneratedColumn()
	_id: number

	@Column({
		unique: true,
		nullable: false,
	})
	username: string

	@Column({
		unique: true,
		nullable: false,
	})
	email: string

	@Column({
		nullable: false,
	})
	password: string

	@OneToMany(() => User, user => user._id, {})
	subscribers: number[]

	@CreateDateColumn()
	createdDate: Date

	@UpdateDateColumn()
	updatedDate: Date
}
