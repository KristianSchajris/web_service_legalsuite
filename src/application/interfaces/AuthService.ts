/**
 * Interfaz para el servicio de autenticación
 */
export interface AuthService {
  generateToken(userId: string, username: string, role: string): string;
  verifyToken(token: string): { userId: string; username: string; role: string } | null;
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}