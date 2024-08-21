'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ludo_Manages', {
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
      dice_1x: {
        type: Sequelize.INTEGER
      },
      dice_2x: {
        type: Sequelize.INTEGER
      },
      dice_3x: {
        type: Sequelize.INTEGER
      },
      change_high: {
        type: Sequelize.INTEGER
      },
      change_low: {
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
    await queryInterface.dropTable('Ludo_Manages');
  }
};