/**
 * Índice de mappers
 * Exporta todos los mappers para facilitar su importación
 */

export { LawyerMapper } from './implementations/LawyerMapper';
export { LawsuitMapper, LawsuitAssignMapper } from './implementations/LawsuitMapper';
export { UserMapper, UserLoginMapper } from './implementations/UserMapper';

// Exportar tipos de mappers
export * from './LawyerMapperTypes';
export * from './LawsuitMapperTypes';
export * from './UserMapperTypes';
export * from './IMapper';