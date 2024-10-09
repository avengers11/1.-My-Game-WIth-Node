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

    await queryInterface.bulkInsert('gready_manages', [{
      favicon: 'favicon.png',
      logo: 'logo.png',
      game_mod: 1,
      game_status: true,

      change_low: 800,
      change_mid: 900,
      change_high: 1000,

      win5x: 800,
      win10x: 850,
      win15x: 900,
      win25x: 950,
      win45x: 1000
      
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
