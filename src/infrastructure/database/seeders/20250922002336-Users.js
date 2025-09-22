'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const saltRounds = 10;
    
    await queryInterface.bulkInsert('Users', [
      {
        id: uuidv4(),
        username: 'admin',
        password: await bcrypt.hash('admin123', saltRounds),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        username: 'operator1',
        password: await bcrypt.hash('operator123', saltRounds),
        role: 'operator',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        username: 'operator2',
        password: await bcrypt.hash('operator456', saltRounds),
        role: 'operator',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        username: 'admin2',
        password: await bcrypt.hash('admin456', saltRounds),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};