import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { LawsuitCaseType, LawsuitStatus } from '../../../domain/entities/Lawsuit';
import LawyerModel from './LawyerModel';

interface LawsuitAttributes {
  id: string;
  case_number: string;
  plaintiff: string;
  defendant: string;
  case_type: string;
  status: string;
  lawyer_id: string | null;
  created_at?: Date;
  updated_at?: Date;
}

interface LawsuitCreationAttributes extends Optional<LawsuitAttributes, 'id' | 'created_at' | 'updated_at'> {}

class LawsuitModel extends Model<LawsuitAttributes, LawsuitCreationAttributes> implements LawsuitAttributes {
  public id!: string;
  public case_number!: string;
  public plaintiff!: string;
  public defendant!: string;
  public case_type!: string;
  public status!: string;
  public lawyer_id!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

LawsuitModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    case_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    plaintiff: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    defendant: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    case_type: {
      type: DataTypes.ENUM(...Object.values(LawsuitCaseType)),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(LawsuitStatus)),
      allowNull: false,
      defaultValue: LawsuitStatus.PENDING,
    },
    lawyer_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Lawyers',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'Lawsuits',
    timestamps: true,
  }
);

// Definir relaciones después de que ambos modelos estén inicializados
const setupAssociations = () => {
  LawsuitModel.belongsTo(LawyerModel, { foreignKey: 'lawyer_id' });
  LawyerModel.hasMany(LawsuitModel, { foreignKey: 'lawyer_id' });
};

// Exportar la función para configurar asociaciones
export { setupAssociations };

export default LawsuitModel;