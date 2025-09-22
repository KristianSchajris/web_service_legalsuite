import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { LawyerStatus } from '../../../domain/entities/Lawyer';

interface LawyerAttributes {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  status: string;
  created_at?: Date;
  updated_at?: Date;
}

interface LawyerCreationAttributes extends Optional<LawyerAttributes, 'id' | 'created_at' | 'updated_at'> {}

class LawyerModel extends Model<LawyerAttributes, LawyerCreationAttributes> implements LawyerAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public phone!: string;
  public specialization!: string;
  public status!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

LawyerModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(LawyerStatus)),
      allowNull: false,
      defaultValue: LawyerStatus.ACTIVE,
    },
  },
  {
    sequelize,
    tableName: 'Lawyers',
    timestamps: true,
  }
);

export default LawyerModel;