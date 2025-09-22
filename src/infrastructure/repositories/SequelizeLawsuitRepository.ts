import { Lawsuit, LawsuitCaseType, LawsuitProps, LawsuitStatus } from '../../domain/entities/Lawsuit';
import { LawsuitRepository } from '../../domain/repositories/LawsuitRepository';
import LawsuitModel from '../database/models/LawsuitModel';
import { Op } from 'sequelize';

export class SequelizeLawsuitRepository implements LawsuitRepository {
  async findAll(
    filters?: { status?: LawsuitStatus, lawyerId?: string },
    page: number = 1,
    limit: number = 10
  ): Promise<{ lawsuits: Lawsuit[], total: number }> {
    const offset = (page - 1) * limit;
    const where: any = {};
    
    if (filters?.status) {
      where.status = filters.status;
    }
    
    if (filters?.lawyerId) {
      where.lawyer_id = filters.lawyerId;
    }
    
    const { count, rows } = await LawsuitModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    const lawsuits = rows.map(row => this.mapModelToEntity(row));
    
    return {
      lawsuits,
      total: count
    };
  }
  
  async findById(id: string): Promise<Lawsuit | null> {
    try {
      console.log(`Buscando demanda con ID: ${id}`);
      
      // Asegurarse de que el ID no esté vacío
      if (!id) {
        console.error('Se proporcionó un ID vacío');
        return null;
      }
      
      // Usamos findByPk con opciones explícitas
      const lawsuitModel = await LawsuitModel.findByPk(id, {
        rejectOnEmpty: false
      });
      
      if (!lawsuitModel) {
        console.error(`No se encontró la demanda con ID: ${id}`);
        // Verificar si hay demandas en la base de datos para propósitos de depuración
        const count = await LawsuitModel.count();
        console.log(`Total de demandas en la base de datos: ${count}`);
        return null;
      }
      
      console.log('Demanda encontrada:', JSON.stringify(lawsuitModel.toJSON(), null, 2));
      const lawsuit = this.mapModelToEntity(lawsuitModel);
      console.log('Demanda mapeada a entidad:', JSON.stringify(lawsuit, null, 2));
      
      return lawsuit;
    } catch (error) {
      console.error('Error al buscar demanda por ID:', {
        error: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined,
        id: id
      });
      return null;
    }
  }
  
  async findByLawyerId(lawyerId: string): Promise<Lawsuit[]> {
    const lawsuitModels = await LawsuitModel.findAll({
      where: { lawyer_id: lawyerId },
      order: [['created_at', 'DESC']]
    });
    
    return lawsuitModels.map(model => this.mapModelToEntity(model));
  }
  
  async create(lawsuit: Lawsuit): Promise<Lawsuit> {
    const lawsuitData = lawsuit.toJSON();
    
    // Mapear los datos de la entidad (camelCase) al modelo de base de datos (snake_case)
    const modelData = {
      id: lawsuitData.id,
      case_number: lawsuitData.caseNumber,
      plaintiff: lawsuitData.plaintiff,
      defendant: lawsuitData.defendant,
      case_type: lawsuitData.caseType,
      status: lawsuitData.status,
      lawyer_id: lawsuitData.lawyerId,
      created_at: lawsuitData.createdAt,
      updated_at: lawsuitData.updatedAt
    };
    
    const createdLawsuit = await LawsuitModel.create(modelData);
    
    return this.mapModelToEntity(createdLawsuit);
  }
  
  async update(lawsuit: Lawsuit): Promise<Lawsuit> {
    try {
      console.log(`Actualizando demanda con ID: ${lawsuit.id}`);
      
      const lawsuitModel = await LawsuitModel.findByPk(lawsuit.id);
      
      if (!lawsuitModel) {
        console.error(`No se encontró la demanda con ID: ${lawsuit.id} para actualizar`);
        throw new Error('Demanda no encontrada');
      }
      
      const lawsuitData = lawsuit.toJSON();
      console.log('Datos a actualizar:', JSON.stringify(lawsuitData, null, 2));
      
      await lawsuitModel.update(lawsuitData);
      
      // Recargar el modelo para asegurarnos de tener los datos más recientes
      await lawsuitModel.reload();
      
      const updatedLawsuit = this.mapModelToEntity(lawsuitModel);
      console.log('Demanda actualizada exitosamente:', JSON.stringify(updatedLawsuit, null, 2));
      
      return updatedLawsuit;
    } catch (error) {
      console.error('Error al actualizar la demanda:', {
        error: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined,
        lawsuitId: lawsuit.id
      });
      throw new Error(`Error al actualizar la demanda: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
  
  async delete(id: string): Promise<boolean> {
    const deleted = await LawsuitModel.destroy({
      where: { id }
    });
    
    return deleted > 0;
  }
  
  private mapModelToEntity(model: any): Lawsuit {
    try {
      console.log('mapModelToEntity - Modelo recibido:', JSON.stringify(model, null, 2));
      
      // Obtener los datos planos del modelo
      const plainData = model.get ? model.get({ plain: true }) : model;
      console.log('mapModelToEntity - Datos planos:', JSON.stringify(plainData, null, 2));
      
      // Mapear nombres de campos de la base de datos (snake_case) a la entidad (camelCase)
      const mappedData = {
        id: plainData.id,
        caseNumber: plainData.case_number,
        plaintiff: plainData.plaintiff,
        defendant: plainData.defendant,
        caseType: plainData.case_type,
        status: plainData.status,
        lawyerId: plainData.lawyer_id,
        createdAt: plainData.createdAt || plainData.created_at,
        updatedAt: plainData.updatedAt || plainData.updated_at
      };
      
      console.log('mapModelToEntity - Datos mapeados:', JSON.stringify(mappedData, null, 2));
      
      // Validar que los campos requeridos estén presentes
      if (!mappedData.id || !mappedData.caseNumber || !mappedData.plaintiff || 
          !mappedData.defendant || !mappedData.caseType || !mappedData.status) {
        console.error('mapModelToEntity - Faltan campos requeridos en los datos de la demanda:', mappedData);
        throw new Error('Datos de la demanda incompletos');
      }
      
      // Asegurarse de que las fechas sean instancias de Date
      const createdAt = mappedData.createdAt ? new Date(mappedData.createdAt) : new Date();
      const updatedAt = mappedData.updatedAt ? new Date(mappedData.updatedAt) : new Date();
      
      // Crear la instancia de Lawsuit con los datos del modelo
      const lawsuit = new Lawsuit({
        id: String(mappedData.id),
        caseNumber: String(mappedData.caseNumber),
        plaintiff: String(mappedData.plaintiff),
        defendant: String(mappedData.defendant),
        caseType: mappedData.caseType as LawsuitCaseType,
        status: mappedData.status as LawsuitStatus,
        lawyerId: mappedData.lawyerId ? String(mappedData.lawyerId) : undefined,
        createdAt,
        updatedAt
      });
      
      console.log('mapModelToEntity - Instancia de Lawsuit creada:', JSON.stringify(lawsuit, null, 2));
      return lawsuit;
    } catch (error) {
      console.error('mapModelToEntity - Error al mapear el modelo a entidad:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al mapear la demanda';
      throw new Error(`Error al mapear la demanda: ${errorMessage}`);
    }
  }
}