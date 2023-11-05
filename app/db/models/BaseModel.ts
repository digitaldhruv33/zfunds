import { Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';

/* BaseModel for default table fields */
@Table({})
abstract class BaseModel extends Model {
	@PrimaryKey
	@Column({
		type: DataType.UUID,
		allowNull: false,
		defaultValue: DataType.UUIDV4,
	})
	id!: string;

	@CreatedAt
	@Column({ type: DataType.DATE, defaultValue: DataType.NOW, allowNull: false })
	createdAt!: Date;

	@UpdatedAt
	@Column({ type: DataType.DATE, defaultValue: DataType.NOW, allowNull: false })
	updatedAt!: Date;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: true,
	})
	is_active!: boolean;
}

export default BaseModel;
