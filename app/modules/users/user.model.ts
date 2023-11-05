import { Table, Column,  DataType } from 'sequelize-typescript';
import BaseModel from '../../db/models/BaseModel';

@Table({
	tableName: 'users',
	modelName: 'Users',
})
class Users extends BaseModel {
	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	name!: string;

	@Column({
		type: DataType.BIGINT,
		allowNull: false,
		unique: true,
	})
	mobile_number!: number;

	@Column({
		type: DataType.ENUM({ values: ['admin', 'user', 'advisor'] }),
		allowNull: false,
	})
	role!: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	advisorId!: string;
}

export default Users;
