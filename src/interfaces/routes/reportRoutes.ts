import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';
import { authMiddleware } from '../../infrastructure/middlewares/authMiddleware';
import { UserRole } from '../../domain/entities/User';
import { DIContainer } from '../../infrastructure/di/DIContainer';

const router = Router();

// Obtener controlador desde el contenedor de dependencias
const diContainer = DIContainer.getInstance();
const reportController = diContainer.get<ReportController>('ReportController');

/**
 * @swagger
 * /api/reports/lawyers/{id}/lawsuits:
 *   get:
 *     summary: Obtener demandas por abogado
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del abogado
 *     responses:
 *       200:
 *         description: Lista de demandas asignadas al abogado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lawsuit'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo administradores
 *       404:
 *         description: Abogado no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/lawyers/:id/lawsuits', authMiddleware([UserRole.ADMIN]), reportController.getLawsuitsByLawyer.bind(reportController));

export default router;