import { UserRepository } from '../../../domain/repositories/UserRepository';
import { AuthService } from '../../interfaces/AuthService';
import { LoginDTO } from '../../interfaces/auth/LoginDTO';
import { LoginResponse } from '../../interfaces/auth/LoginResponse';
import { Logger } from '../../../domain/interfaces/Logger';

export class LoginUseCase {
    constructor(
        private sequelizeUserRepository: UserRepository,
        private authService: AuthService,
        private logger: Logger
    ) { }

    async execute(data: LoginDTO): Promise<LoginResponse> {
        this.logger.info('Iniciando proceso de login para usuario:', data.username);

        // Validar datos
        if (!data.username || !data.password) {
            this.logger.warn('Error: Usuario o contraseña no proporcionados');
            throw new Error('Usuario y contraseña son requeridos');
        }

        try {
            // Buscar usuario
            this.logger.info('Buscando usuario en la base de datos...');
            const user = await this.sequelizeUserRepository.findByUsername(data.username);
            this.logger.info('Usuario encontrado:', user ? 'Sí' : 'No');

            if (!user) {
                this.logger.warn('Error: Usuario no encontrado');
                throw new Error('Credenciales inválidas');
            }

            // Verificar contraseña
            this.logger.debug('Comparando contraseñas...');
            // Información sensible removida por seguridad

            if (!user.password) {
                this.logger.error('Error: La contraseña del usuario no está definida en la base de datos');
                throw new Error('Error en las credenciales');
            }

            const isPasswordValid = await this.authService.comparePassword(
                data.password,
                user.password
            );
            this.logger.debug('Resultado de la comparación de contraseñas:', isPasswordValid);

            if (!isPasswordValid) {
                this.logger.warn('Error: Contraseña incorrecta');
                throw new Error('Credenciales inválidas');
            }

            // Generar token
            const token = this.authService.generateToken(
                user.id!,
                user.username,
                user.role
            );

            return {
                token,
                user: {
                    id: user.id!,
                    username: user.username,
                    role: user.role
                }
            };
        } catch (error) {
            // Registrar el error original para debugging
            this.logger.error('Error durante el proceso de autenticación:', error);
            
            // Si el error ya tiene un mensaje, lo propagamos
            if (error instanceof Error) {
                throw error;
            }
            // Si no, lanzamos un error genérico
            throw new Error('Error en la autenticación');
        }
    }
}
