import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { UserRole } from '../../../domain/entities/User';

interface UserAttributes {
  id: string;
  username: string;
  password: string;
  role: string;
  created_at?: Date;
  updated_at?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at'> {}

class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public username!: string;
  public password!: string;
  public role!: string;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.OPERATOR,
    },
  },
  {
    sequelize,
    tableName: 'Users',
    timestamps: true,
  }
);

export default UserModel;