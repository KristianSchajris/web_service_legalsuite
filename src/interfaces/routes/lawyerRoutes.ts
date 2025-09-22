import { Router } from 'express';
import { LawyerController } from '../controllers/LawyerController';
import { authMiddleware } from '../../infrastructure/middlewares/authMiddleware';
import { UserRole } from '../../domain/entities/User';
import { DIContainer } from '../../infrastructure/di/DIContainer';

const router = Router();

// Obtener controlador desde el contenedor de dependencias
const diContainer = DIContainer.getInstance();
const lawyerController = diContainer.get<LawyerController>('LawyerController');

/**
 * @swagger
 * /api/lawyers:
 *   get:
 *     summary: Obtener todos los abogados
 *     tags: [Lawyers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de abogados obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lawyer'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authMiddleware(), lawyerController.getAll.bind(lawyerController));

/**
 * @swagger
 * /api/lawyers/{id}:
 *   get:
 *     summary: Obtener un abogado por ID
 *     tags: [Lawyers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del abogado
 *     responses:
 *       200:
 *         description: Abogado encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lawyer'
 *       404:
 *         description: Abogado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', authMiddleware(), lawyerController.getById.bind(lawyerController));

/**
 * @swagger
 * /api/lawyers:
 *   post:
 *     summary: Crear un nuevo abogado
 *     tags: [Lawyers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LawyerInput'
 *     responses:
 *       201:
 *         description: Abogado creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lawyer'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Permisos insuficientes (solo administradores)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authMiddleware([UserRole.ADMIN]), lawyerController.create.bind(lawyerController));

export default router;