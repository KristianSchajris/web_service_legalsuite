'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Primero obtenemos los IDs de los abogados para las relaciones
    const lawyers = await queryInterface.sequelize.query(
      'SELECT id FROM "Lawyers" ORDER BY "createdAt" LIMIT 8',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const lawyerIds = lawyers.map(lawyer => lawyer.id);
    const caseNumber = 'DEM-' + new Date().getFullYear();

    await queryInterface.bulkInsert('Lawsuits', [
      {
        id: uuidv4(),
        case_number: caseNumber + '-001',
        plaintiff: 'Juan Carlos Mendoza',
        defendant: 'Empresa ABC S.A.S.',
        case_type: 'Laboral',
        status: 'assigned',
        lawyer_id: lawyerIds[0],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        case_number: caseNumber + '-002',
        plaintiff: 'María Elena Rodríguez',
        defendant: 'Pedro Antonio López',
        case_type: 'Civil',
        status: 'assigned',
        lawyer_id: lawyerIds[1],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        case_number: caseNumber + '-003',
        plaintiff: 'Fiscalía General de la Nación',
        defendant: 'Carlos Alberto Jiménez',
        case_type: 'criminal',
        status: 'pending',
        lawyer_id: lawyerIds[2],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        case_number: caseNumber + '-004',
        plaintiff: 'Distribuidora XYZ Ltda.',
        defendant: 'Proveedores Unidos S.A.',
        case_type: 'Comercial',
        status: 'assigned',
        lawyer_id: lawyerIds[3],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        case_number: caseNumber + '-005',
        plaintiff: 'Ana Patricia Herrera',
        defendant: 'Roberto Silva Martínez',
        case_type: 'laboral',
        status: 'resolved',
        lawyer_id: lawyerIds[4],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        case_number: caseNumber + '-006',
        plaintiff: 'DIAN',
        defendant: 'Comercializadora DEF S.A.S.',
        case_type: 'laboral',
        status: 'assigned',
        lawyer_id: lawyerIds[5],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        case_number: caseNumber + '-007',
        plaintiff: 'Ciudadano Común',
        defendant: 'Alcaldía Municipal',
        case_type: 'comercial',
        status: 'pending',
        lawyer_id: lawyerIds[6],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        case_number: caseNumber + '-008',
        plaintiff: 'Sindicato de Trabajadores',
        defendant: 'Industrias GHI S.A.',
        case_type: 'comercial',
        status: 'assigned',
        lawyer_id: lawyerIds[7],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        case_number: caseNumber + '-009',
        plaintiff: 'Constructora JKL Ltda.',
        defendant: 'Propietarios Edificio MNO',
        case_type: 'comercial',
        status: 'resolved',
        lawyer_id: lawyerIds[1],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        case_number: caseNumber + '-010',
        plaintiff: 'Ministerio Público',
        defendant: 'Grupo Delictivo PQR',
        case_type: 'comercial',
        status: 'assigned',
        lawyer_id: lawyerIds[2],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Lawsuits', null, {});
  }
};
