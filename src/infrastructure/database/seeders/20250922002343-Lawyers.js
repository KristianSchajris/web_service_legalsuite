'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const lawyerIds = [...Array(10)].map(() => uuidv4());

    await queryInterface.bulkInsert('Lawyers', [
      {
        id: lawyerIds[0],
        name: 'Carlos Pérez',
        email: 'carlos.perez@example.com',
        phone: '3001234567',
        specialization: 'civil',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: lawyerIds[1],
        name: 'María González',
        email: 'maria.gonzalez@example.com',
        phone: '3009876543',
        specialization: 'civil',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: lawyerIds[2], 
        name: 'Juan Rodríguez',
        email: 'juan.rodriguez@example.com',
        phone: '3005551234',
        specialization: 'civil',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: lawyerIds[3],
        name: 'Ana Martínez',
        email: 'ana.martinez@example.com',
        phone: '3007778888',
        specialization: 'comercial',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: lawyerIds[4],
        name: 'Luis Fernández',
        email: 'luis.fernandez@example.com',
        phone: '3002223333',
        specialization: 'civil',
        status: 'inactive',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: lawyerIds[5],
        name: 'Carmen López',
        email: 'carmen.lopez@example.com',
        phone: '3004445555',
        specialization: 'criminal',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: lawyerIds[6],
        name: 'Roberto Silva',
        email: 'roberto.silva@example.com',
        phone: '3006667777',
        specialization: 'comercial',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        id: lawyerIds[7],
        name: 'Patricia Herrera',
        email: 'patricia.herrera@example.com',
        phone: '3008889999',
        specialization: 'laboral',
        status: 'inactive',
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        id: lawyerIds[8],
        name: 'Diego Martínez',
        email: 'diego.martinez@example.com',
        phone: '3003334444',
        specialization: 'laboral',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        id: lawyerIds[9],
        name: 'Diego perea',
        email: 'diego.perea@example.com',
        phone: '3003334444',
        specialization: 'laboral',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Lawyers', null, {});
  }
};
