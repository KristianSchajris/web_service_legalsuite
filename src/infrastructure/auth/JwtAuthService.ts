import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthService } from '../../application/interfaces/AuthService';
import { User } from '../../domain/entities/User';

export class JwtAuthService implements AuthService {
  private readonly secretKey: string;
  private readonly expiresIn: string;
  private readonly saltRounds: number;

  constructor() {
    this.secretKey = process.env.JWT_SECRET || 'default_secret_key_change_in_production';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    this.saltRounds = 10;
  }

  generateToken(userId: string, username: string, role: string): string {
    const payload = {
      userId,
      username,
      role
    };

    // Usar la sintaxis correcta para jwt.sign
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn } as jwt.SignOptions);
  }

  verifyToken(token: string): { userId: string; username: string; role: string } | null {
    try {
      const decoded = jwt.verify(token, this.secretKey) as { userId: string; username: string; role: string };
      return decoded;
    } catch (error) {
      return null;
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}