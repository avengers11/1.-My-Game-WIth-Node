'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('ludo_manages', [{
      favicon: 'favicon.png',
      logo: 'logo.png',
      game_mod: true,
      game_status: true,
      dice_1x: 800,
      dice_2x: 950,
      dice_3x: 100,
      change_low: 800,
      change_high: 1000
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
