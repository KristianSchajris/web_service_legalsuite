import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/interfaces/AuthService';
import { DIContainer } from '../di/DIContainer';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware de autenticación basado en clase
 * Permite inyección de dependencias y mejor testabilidad
 */
export class AuthMiddleware {
  private authService: AuthService;

  constructor(authService?: AuthService) {
    this.authService = authService || DIContainer.getInstance().get<AuthService>('AuthService');
  }

  /**
   * Crea un middleware de autenticación con roles opcionales
   * @param requiredRoles Roles requeridos para acceder al recurso
   * @returns Middleware de Express
   */
  authenticate(requiredRoles?: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = this.authService.verifyToken(token);
        
        if (!decoded) {
          return res.status(401).json({ message: 'Token inválido o expirado' });
        }
        
        req.user = decoded;
        
        // Verificar roles si se especifican
        if (requiredRoles && requiredRoles.length > 0) {
          if (!requiredRoles.includes(decoded.role)) {
            return res.status(403).json({ message: 'No tiene permisos para acceder a este recurso' });
          }
        }
        
        next();
      } catch (error) {
        return res.status(500).json({ message: 'Error en la autenticación' });
      }
    };
  }
}

// Instancia por defecto para compatibilidad hacia atrás
const authMiddlewareInstance = new AuthMiddleware();

/**
 * Función de compatibilidad hacia atrás
 * @deprecated Usar AuthMiddleware class en su lugar
 */
export const authMiddleware = (requiredRoles?: string[]) => {
  return authMiddlewareInstance.authenticate(requiredRoles);
};