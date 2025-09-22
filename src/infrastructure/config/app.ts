import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { swaggerUi, specs } from './swagger';
import lawyerRoutes from '../../interfaces/routes/lawyerRoutes';
import lawsuitRoutes from '../../interfaces/routes/lawsuitRoutes';
import authRoutes from '../../interfaces/routes/authRoutes';
import reportRoutes from '../../interfaces/routes/reportRoutes';
import { ExpressAppInterface } from '../interfaces/ExpressAppInterface';
import { errorHandler } from '../utils/ErrorHandler';

/**
 * Clase para configurar y manejar la aplicación Express
 * Implementa el patrón Singleton para garantizar una única instancia de la aplicación
 */
export class ExpressApp implements ExpressAppInterface {
    private static instance: ExpressApp;
    private app: Application;

    private constructor() {
        this.app = express();
        this.setupMiddlewares();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    /**
     * Obtiene la instancia única de ExpressApp
     * @returns La instancia de ExpressApp
     */
    public static getInstance(): ExpressApp {
        if (!ExpressApp.instance) {
            ExpressApp.instance = new ExpressApp();
        }
        return ExpressApp.instance;
    }

    /**
     * Configura los middlewares de la aplicación
     */
    private setupMiddlewares(): void {
        // Middleware para generar requestId
        this.app.use(errorHandler.requestIdMiddleware());
        
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    /**
     * Configura las rutas de la aplicación
     */
    private setupRoutes(): void {
        // Documentación Swagger
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

        // Rutas de la API
        this.app.use('/api/lawyers', lawyerRoutes);
        this.app.use('/api/lawsuits', lawsuitRoutes);
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/reports', reportRoutes);
    }

    /**
     * Configura el manejo de errores global
     */
    private setupErrorHandling(): void {
        // Middleware global de manejo de errores usando el nuevo sistema
        this.app.use(errorHandler.globalErrorMiddleware());
    }

    /**
     * Obtiene la instancia de Express configurada
     * @returns La aplicación Express
     */
    public getApp(): Application {
        return this.app;
    }

    /**
     * Agrega un middleware personalizado a la aplicación
     * @param middleware El middleware a agregar
     */
    public addMiddleware(middleware: any): void {
        this.app.use(middleware);
    }

    /**
     * Agrega una ruta personalizada a la aplicación
     * @param path La ruta
     * @param router El router o handler
     */
    public addRoute(path: string, router: any): void {
        this.app.use(path, router);
    }

    /**
     * Reinicia la configuración de la aplicación
     * Útil para testing o reconfiguración dinámica
     */
    public reset(): void {
        this.app = express();
        this.setupMiddlewares();
        this.setupRoutes();
        this.setupErrorHandling();
    }
}

// Exportar la instancia de Express para compatibilidad hacia atrás
const expressApp = ExpressApp.getInstance();
const app = expressApp.getApp();

export default app;
