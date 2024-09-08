'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gready_manages', {
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
      next_win: {
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
      win5x: {
        type: Sequelize.INTEGER
      },
      win10x: {
        type: Sequelize.INTEGER
      },
      win15x: {
        type: Sequelize.INTEGER
      },
      win25x: {
        type: Sequelize.INTEGER
      },
      win45x: {
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
    await queryInterface.dropTable('gready_manages');
  }
};