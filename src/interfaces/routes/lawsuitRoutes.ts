import { Router } from 'express';
import { LawsuitController } from '../controllers/LawsuitController';
import { authMiddleware } from '../../infrastructure/middlewares/authMiddleware';
import { UserRole } from '../../domain/entities/User';
import { DIContainer } from '../../infrastructure/di/DIContainer';

const router = Router();

// Obtener controlador desde el contenedor de dependencias
const diContainer = DIContainer.getInstance();
const lawsuitController = diContainer.get<LawsuitController>('LawsuitController');

/**
 * @swagger
 * /api/lawsuits:
 *   get:
 *     summary: Obtener todas las demandas
 *     description: >
 *       Lista todas las demandas del sistema.
 *       Soporta filtros opcionales por status y lawyer_id mediante query parameters.
 *     tags: [Demandas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: ['pending', 'assigned', 'resolved']
 *         description: Filtrar demandas por estado
 *         example: pending
 *       - in: query
 *         name: lawyer_id
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar demandas por ID del abogado asignado
 *         example: 4eb014f3-cf4d-4363-9f0a-f6814f3cce3c
 *     responses:
 *       200:
 *         description: Lista de demandas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lawsuit'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/', authMiddleware(), lawsuitController.getAll.bind(lawsuitController));

// ENDPOINT ELIMINADO: GET /:id - No está en la lista de endpoints permitidos
// /**
//  * @swagger
//  * /api/lawsuits/{id}:
//  *   get:
//  *     summary: Obtener una demanda por ID
//  *     tags: [Demandas]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: ID de la demanda
//  *     responses:
//  *       200:
//  *         description: Datos de la demanda
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Lawsuit'
//  *       404:
//  *         description: Demanda no encontrada
//  *       401:
//  *         description: No autorizado
//  *       500:
//  *         description: Error del servidor
//  */
// router.get('/:id', authMiddleware(), lawsuitController.getById.bind(lawsuitController));

/**
 * @swagger
 * /api/lawsuits:
 *   post:
 *     summary: Crear una nueva demanda
 *     description: >
 *       Crea una nueva demanda en el sistema. 
 *       Requiere permisos de administrador.
 *       Los campos deben enviarse en formato snake_case.
 *     tags: [Demandas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Datos de la demanda a crear
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LawsuitInput'
 *           example:
 *             case_number: "CASE-2024-001"
 *             plaintiff: "Juan Pérez"
 *             defendant: "Empresa ABC"
 *             case_type: "civil"
 *             status: "pending"
 *     responses:
 *       201:
 *         description: Demanda creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lawsuit'
 *             example:
 *               id: "76e13ef9-9674-4cee-93ba-62dd6a292477"
 *               case_number: "CASE-2024-001"
 *               plaintiff: "Juan Pérez"
 *               defendant: "Empresa ABC"
 *               case_type: "civil"
 *               status: "pending"
 *               lawyer_id: null
 *               created_at: "2025-09-22T02:02:44.291Z"
 *               updated_at: "2025-09-22T02:02:44.291Z"
 *       400:
 *         description: Datos inválidos o faltan campos obligatorios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 message: "Faltan campos obligatorios"
 *                 category: "VALIDATION"
 *                 timestamp: "2025-09-22T02:02:44.291Z"
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo administradores
 *       500:
 *         description: Error del servidor
 */
router.post('/', authMiddleware([UserRole.ADMIN]), lawsuitController.create.bind(lawsuitController));

/**
 * @swagger
 * /api/lawsuits/{id}/assign:
 *   put:
 *     summary: Asigna un abogado a un caso legal existente
 *     description: Asigna un abogado a un caso legal específico
 *     tags: [Demandas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único de la demanda a la que se asignará el abogado
 *         example: 50ca0b2e-178b-40bf-81e1-6732a07b8802
 *     requestBody:
 *       required: true
 *       description: Datos del abogado a asignar
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lawyer_id
 *             properties:
 *               lawyer_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID único del abogado que se asignará al caso (debe ser un ID de abogado activo)
 *                 example: 4eb014f3-cf4d-4363-9f0a-f6814f3cce3c
 *     responses:
 *       200:
 *         description: Abogado asignado correctamente al caso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lawsuit'
 *       400:
 *         description: >
 *           Error en la petición. Puede deberse a:
 *           - Falta el ID del abogado
 *           - El abogado no está activo
 *           - Datos inválidos en la petición
 *           - El ID de la demanda o del abogado no existe
 *       401:
 *         description: No autorizado - Token JWT inválido o no proporcionado
 *       403:
 *         description: Acceso prohibido - Se requieren permisos de administrador
 *       404:
 *         description: No se encontró la demanda o el abogado especificado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id/assign', authMiddleware([UserRole.ADMIN]), lawsuitController.assignLawyer.bind(lawsuitController));

export default router;