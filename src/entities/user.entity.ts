import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { AuthType } from '../enums/auth-type.enum'

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

	@ManyToMany(() => User, user => user.subscribed)
	@JoinTable()
	subscribers: User[]

	@ManyToMany(() => User, user => user.subscribers)
	subscribed: User[]

	@Column({ default: AuthType.Local })
	authType: AuthType

	@CreateDateColumn()
	createdDate: Date

	@UpdateDateColumn()
	updatedDate: Date
}
