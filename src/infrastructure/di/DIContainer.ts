/**
 * Contenedor de Inyección de Dependencias
 * Centraliza la creación y gestión de dependencias siguiendo Clean Architecture
 */

import { LawyerRepository } from '../../domain/repositories/LawyerRepository';
import { LawsuitRepository } from '../../domain/repositories/LawsuitRepository';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { Logger } from '../../domain/interfaces/Logger';

import { SequelizeLawyerRepository } from '../repositories/SequelizeLawyerRepository';
import { SequelizeLawsuitRepository } from '../repositories/SequelizeLawsuitRepository';
import { SequelizeUserRepository } from '../repositories/SequelizeUserRepository';
import { ConsoleLogger } from '../logging/ConsoleLogger';
import { StructuredConsoleLogger } from '../logging/StructuredConsoleLogger';

import { CreateLawyerUseCase } from '../../application/use-cases/lawyer/CreateLawyerUseCase';
import { GetLawyersUseCase } from '../../application/use-cases/lawyer/GetLawyersUseCase';
import { GetLawyerByIdUseCase } from '../../application/use-cases/lawyer/GetLawyerByIdUseCase';

import { CreateLawsuitUseCase } from '../../application/use-cases/lawsuit/CreateLawsuitUseCase';
import { GetLawsuitsUseCase } from '../../application/use-cases/lawsuit/GetLawsuitsUseCase';
import { AssignLawyerToLawsuitUseCase } from '../../application/use-cases/lawsuit/AssignLawyerToLawsuitUseCase';
import { GetLawsuitsByLawyerUseCase } from '../../application/use-cases/lawsuit/GetLawsuitsByLawyerUseCase';

import { LoginUseCase } from '../../application/use-cases/auth/LoginUseCase';

import { LawyerController } from '../../interfaces/controllers/LawyerController';
import { LawsuitController } from '../../interfaces/controllers/LawsuitController';
import { AuthController } from '../../interfaces/controllers/AuthController';
import { ReportController } from '../../interfaces/controllers/ReportController';

import { JwtAuthService } from '../auth/JwtAuthService';
import { AuthService } from '../../application/interfaces/AuthService';

export class DIContainer {
  private static instance: DIContainer;
  private dependencies: Map<string, any> = new Map();

  private constructor() {
    this.registerDependencies();
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  private registerDependencies(): void {
    // Registrar repositorios
    this.dependencies.set('LawyerRepository', new SequelizeLawyerRepository());
    this.dependencies.set('LawsuitRepository', new SequelizeLawsuitRepository());
    this.dependencies.set('UserRepository', new SequelizeUserRepository());
    
    // Registrar logger (mantiene compatibilidad con Logger existente)
    this.dependencies.set('Logger', new StructuredConsoleLogger('legal-suite-service'));

    // Registrar servicios
    this.dependencies.set('AuthService', new JwtAuthService());

    // Registrar casos de uso de Lawyer
    this.dependencies.set('CreateLawyerUseCase', new CreateLawyerUseCase(
      this.get<LawyerRepository>('LawyerRepository')
    ));
    this.dependencies.set('GetLawyersUseCase', new GetLawyersUseCase(
      this.get<LawyerRepository>('LawyerRepository')
    ));
    this.dependencies.set('GetLawyerByIdUseCase', new GetLawyerByIdUseCase(
      this.get<LawyerRepository>('LawyerRepository'),
      this.get<Logger>('Logger')
    ));

    // Registrar casos de uso de Lawsuit
    this.dependencies.set('CreateLawsuitUseCase', new CreateLawsuitUseCase(
      this.get<LawsuitRepository>('LawsuitRepository')
    ));
    this.dependencies.set('GetLawsuitsUseCase', new GetLawsuitsUseCase(
      this.get<LawsuitRepository>('LawsuitRepository')
    ));
    this.dependencies.set('AssignLawyerToLawsuitUseCase', new AssignLawyerToLawsuitUseCase(
      this.get<LawsuitRepository>('LawsuitRepository'),
      this.get<LawyerRepository>('LawyerRepository'),
      this.get<Logger>('Logger')
    ));
    this.dependencies.set('GetLawsuitsByLawyerUseCase', new GetLawsuitsByLawyerUseCase(
      this.get<LawsuitRepository>('LawsuitRepository'),
      this.get<LawyerRepository>('LawyerRepository')
    ));

    // Registrar casos de uso de Auth
    this.dependencies.set('LoginUseCase', new LoginUseCase(
      this.get<UserRepository>('UserRepository'),
      this.get<AuthService>('AuthService'),
      this.get<Logger>('Logger')
    ));

    // Registrar controladores
    this.dependencies.set('LawyerController', new LawyerController(
      this.get<CreateLawyerUseCase>('CreateLawyerUseCase'),
      this.get<GetLawyersUseCase>('GetLawyersUseCase'),
      this.get<GetLawyerByIdUseCase>('GetLawyerByIdUseCase')
    ));

    this.dependencies.set('LawsuitController', new LawsuitController(
      this.get<CreateLawsuitUseCase>('CreateLawsuitUseCase'),
      this.get<GetLawsuitsUseCase>('GetLawsuitsUseCase'),
      this.get<AssignLawyerToLawsuitUseCase>('AssignLawyerToLawsuitUseCase')
    ));

    this.dependencies.set('AuthController', new AuthController(
      this.get<LoginUseCase>('LoginUseCase')
    ));

    this.dependencies.set('ReportController', new ReportController(
      this.get<GetLawsuitsByLawyerUseCase>('GetLawsuitsByLawyerUseCase')
    ));
  }

  public get<T>(key: string): T {
    const dependency = this.dependencies.get(key);
    if (!dependency) {
      throw new Error(`Dependency ${key} not found in container`);
    }
    return dependency as T;
  }

  public register<T>(key: string, instance: T): void {
    this.dependencies.set(key, instance);
  }
}