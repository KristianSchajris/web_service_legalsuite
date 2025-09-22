import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { DIContainer } from '../../infrastructure/di/DIContainer';

const router = Router();

// Obtener controlador desde el contenedor de dependencias
const diContainer = DIContainer.getInstance();
const authController = diContainer.get<AuthController>('AuthController');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Obtener token de acceso
 *     description: Autentica un usuario y devuelve un token JWT para acceder a los endpoints protegidos
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             username: "example"
 *             password: "example"
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjk5OTk5OTk5fQ.example"
 *               user:
 *                 id: "1"
 *                 username: "admin"
 *                 role: "admin"
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Usuario y contraseña son requeridos"
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Credenciales inválidas"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Error interno del servidor"
 */
router.post('/login', authController.login.bind(authController));

export default router;