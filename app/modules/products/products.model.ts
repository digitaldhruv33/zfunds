import { Table, Column, DataType } from 'sequelize-typescript';
import BaseModel from '../../db/models/BaseModel';

@Table({
	tableName: 'products',
	modelName: 'Products',
})
class Products extends BaseModel {
	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true,
	})
	name!: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	category!: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	description!: string;
}

export default Products;
