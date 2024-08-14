'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('JiliFish_Manages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      favicon: {
        type: Sequelize.STRING
      },
      logo: {
        type: Sequelize.STRING
      },
      game_mod: {
        type: Sequelize.BOOLEAN
      },
      game_status: {
        type: Sequelize.BOOLEAN
      },
      change_2: {
        type: Sequelize.INTEGER
      },
      change_3: {
        type: Sequelize.INTEGER
      },
      change_low: {
        type: Sequelize.INTEGER
      },
      change_mid: {
        type: Sequelize.INTEGER
      },
      change_high: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('JiliFish_Manages');
  }
};