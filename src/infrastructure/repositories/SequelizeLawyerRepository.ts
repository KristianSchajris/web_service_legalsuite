import { Lawyer, LawyerProps, LawyerStatus } from '../../domain/entities/Lawyer';
import { LawyerRepository } from '../../domain/repositories/LawyerRepository';
import LawyerModel from '../database/models/LawyerModel';

export class SequelizeLawyerRepository implements LawyerRepository {
  async findAll(page: number = 1, limit: number = 10): Promise<{ lawyers: Lawyer[], total: number }> {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await LawyerModel.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    const lawyers = rows.map(row => this.mapModelToEntity(row));
    
    return {
      lawyers,
      total: count
    };
  }
  
  async findById(id: string): Promise<Lawyer | null> {
    console.log('SequelizeLawyerRepository - Buscando abogado con ID:', id);
    
    try {
      const lawyerModel = await LawyerModel.findByPk(id);
      console.log('SequelizeLawyerRepository - Resultado de findByPk:', lawyerModel ? 'Encontrado' : 'No encontrado');
      
      if (!lawyerModel) {
        console.log('SequelizeLawyerRepository - No se encontró el abogado con ID:', id);
        return null;
      }
      
      console.log('SequelizeLawyerRepository - Datos del modelo:', JSON.stringify(lawyerModel.get({ plain: true }), null, 2));
      const mappedEntity = this.mapModelToEntity(lawyerModel);
      console.log('SequelizeLawyerRepository - Entidad mapeada:', JSON.stringify(mappedEntity, null, 2));
      
      return mappedEntity;
    } catch (error) {
      console.error('SequelizeLawyerRepository - Error al buscar abogado por ID:', error);
      throw error;
    }
  }
  
  async create(lawyer: Lawyer): Promise<Lawyer> {
    const lawyerData = lawyer.toJSON();
    const createdLawyer = await LawyerModel.create(lawyerData);
    
    return this.mapModelToEntity(createdLawyer);
  }
  
  async update(lawyer: Lawyer): Promise<Lawyer> {
    const lawyerModel = await LawyerModel.findByPk(lawyer.id);
    
    if (!lawyerModel) {
      throw new Error('Abogado no encontrado');
    }
    
    const lawyerData = lawyer.toJSON();
    await lawyerModel.update(lawyerData);
    
    return this.mapModelToEntity(lawyerModel);
  }
  
  async delete(id: string): Promise<boolean> {
    const deleted = await LawyerModel.destroy({
      where: { id }
    });
    
    return deleted > 0;
  }
  
  private mapModelToEntity(model: any): Lawyer {
    try {
      console.log('mapModelToEntity - Modelo recibido:', JSON.stringify(model, null, 2));
      
      // Obtener los datos planos del modelo
      const plainData = model.get ? model.get({ plain: true }) : model;
      console.log('mapModelToEntity - Datos planos:', JSON.stringify(plainData, null, 2));
      
      // Asegurarse de que las fechas sean instancias de Date
      const createdAt = plainData.createdAt ? new Date(plainData.createdAt) : undefined;
      const updatedAt = plainData.updatedAt ? new Date(plainData.updatedAt) : undefined;
      
      // Validar que los campos requeridos estén presentes
      if (!plainData.id || !plainData.name || !plainData.email || !plainData.phone || !plainData.specialization || !plainData.status) {
        console.error('mapModelToEntity - Faltan campos requeridos:', plainData);
        throw new Error('Datos del abogado incompletos');
      }
      
      // Crear la instancia de Lawyer con los datos del modelo
      const lawyer = new Lawyer({
        id: String(plainData.id),
        name: String(plainData.name),
        email: String(plainData.email),
        phone: String(plainData.phone),
        specialization: String(plainData.specialization),
        status: plainData.status as LawyerStatus,
        createdAt,
        updatedAt
      });
      
      console.log('mapModelToEntity - Instancia de Lawyer creada:', JSON.stringify(lawyer, null, 2));
      return lawyer;
    } catch (error: any) {
      console.error('mapModelToEntity - Error al mapear el modelo a entidad:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al mapear el abogado';
      throw new Error(`Error al mapear el abogado: ${errorMessage}`);
    }
  }
}