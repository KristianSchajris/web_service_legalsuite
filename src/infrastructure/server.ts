import { ServerInterface } from '../application/interfaces/ServerInterface';
import { DatabaseInterface } from '../application/interfaces/DatabaseInterface';
import { WebApplicationInterface } from '../application/interfaces/WebApplicationInterface';
import { ConfigurationInterface } from '../application/interfaces/ConfigurationInterface';
import { ExpressAppInterface } from './interfaces/ExpressAppInterface';
import { ExpressApp } from './config/app';
import { SequelizeDatabaseAdapter } from './adapters/SequelizeDatabaseAdapter';
import { ExpressWebApplicationAdapter } from './adapters/ExpressWebApplicationAdapter';
import { DotenvConfigurationAdapter } from './adapters/DotenvConfigurationAdapter';

export class Server implements ServerInterface {
  private static instance: Server;
  private expressApp: ExpressAppInterface;
  private webApp: WebApplicationInterface;
  private database: DatabaseInterface;
  private config: ConfigurationInterface;
  private port: number;

  private constructor(
    expressApp?: ExpressAppInterface,
    webApp?: WebApplicationInterface,
    database?: DatabaseInterface,
    config?: ConfigurationInterface
  ) {
    // Inicializar configuración
    this.config = config || new DotenvConfigurationAdapter();
    this.config.initialize();
    
    // Inicializar aplicación Express
    this.expressApp = expressApp || ExpressApp.getInstance();
    
    // Inicializar aplicación web
    const app = this.expressApp.getApp();
    this.webApp = webApp || new ExpressWebApplicationAdapter(app);
    
    // Inicializar base de datos
    this.database = database || new SequelizeDatabaseAdapter();
    
    this.port = this.config.getPort();
  }

    public static getInstance(
        expressApp?: ExpressAppInterface,
        webApp?: WebApplicationInterface,
        database?: DatabaseInterface,
        config?: ConfigurationInterface
    ): Server {
        if (!Server.instance) {
            Server.instance = new Server(expressApp, webApp, database, config);
            console.log('Server instance created');
        }
        return Server.instance;
    }

    public async start(): Promise<void> {
        try {
            await this.syncDatabase();
            this.startServer();
            this.setupProcessHandlers();
        } catch (error) {
            this.handleError(error);
        }
    }

    private async syncDatabase(): Promise<void> {
        await this.database.sync({
            alter: process.env.NODE_ENV === 'development'
        });
        console.log('Database synchronized successfully');
    }

    private startServer(): void {
        this.webApp.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }

    private setupProcessHandlers(): void {
        // Manejo de señales para cierre graceful
        process.on('SIGINT', async () => {
            try {
                await this.database.close();
                console.log('Closing connection to the database');
                process.exit(0);
            } catch (error) {
                console.error('Error at closing connection to the database:', error);
                process.exit(1);
            }
        });
    }

    private handleError(error: unknown): never {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }

    // Punto de entrada de la aplicación
    public static async bootstrap(): Promise<void> {
        try {
            const server = Server.getInstance();
            await server.start();
            console.log(`Server started successfully`);
        } catch (error) {
            console.error('Error at starting server:', error);
            process.exit(1);
        }
    }
}
