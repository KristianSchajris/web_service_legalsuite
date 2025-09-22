import { User, UserProps, UserRole } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import UserModel from '../database/models/UserModel';

export class SequelizeUserRepository implements UserRepository {
  async findByUsername(username: string): Promise<User | null> {
    console.log(`Buscando usuario con username: ${username}`);
    
    try {
      // Usar findOne sin raw: true para obtener una instancia del modelo
      const userModel = await UserModel.findOne({
        where: { username },
        attributes: ['id', 'username', 'password', 'role', 'createdAt', 'updatedAt']
      });
      
      console.log('Resultado de la consulta:', userModel ? 'Usuario encontrado' : 'Usuario no encontrado');
      
      if (!userModel) {
        console.log('Usuario no encontrado');
        return null;
      }
      
      // Verificar que el modelo tenga los datos esperados
      const userData = userModel.get({ plain: true });
      console.log('Datos del usuario encontrado:', {
        id: userData.id,
        username: userData.username,
        hasPassword: !!userData.password,
        role: userData.role
      });
      
      return this.mapModelToEntity(userModel);
    } catch (error) {
      console.error('Error en findByUsername:', error);
      throw error;
    }
  }
  
  async findById(id: string): Promise<User | null> {
    const userModel = await UserModel.findByPk(id);
    
    if (!userModel) {
      return null;
    }
    
    return this.mapModelToEntity(userModel);
  }
  
  async create(user: User): Promise<User> {
    const userData = {
      username: user.username,
      password: user.password,
      role: user.role
    };
    
    const createdUser = await UserModel.create(userData);
    
    return this.mapModelToEntity(createdUser);
  }
  
  private mapModelToEntity(model: UserModel): User {
    // Obtener los datos planos del modelo
    const userData = model.get({ plain: true });
    
    console.log('Mapeando modelo a entidad - Password:', userData.password ? 'PRESENTE' : 'AUSENTE');
    
    if (!userData.password) {
      console.error('Error: La contraseña no está definida en el modelo');
      console.error('Datos completos del modelo:', JSON.stringify(userData, null, 2));
      throw new Error('Error en las credenciales');
    }
    
    const userProps: UserProps = {
      id: userData.id,
      username: userData.username,
      password: userData.password, // Asegurarse de que la contraseña se pase correctamente
      role: userData.role as UserRole,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
    };
    
    console.log('UserProps:', { 
      id: userProps.id,
      username: userProps.username,
      hasPassword: !!userProps.password,
      role: userProps.role,
      createdAt: userProps.createdAt,
      updatedAt: userProps.updatedAt
    });
    
    return new User(userProps);
  }
}