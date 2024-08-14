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
    await queryInterface.bulkInsert('users', [{
      name: 'User 1',
      amount: 10000,
      image: 'user1.png'
    },{
      name: 'User 2',
      amount: 10000,
      image: 'user2.png'
    },{
      name: 'User 3',
      amount: 10000,
      image: 'user3.png'
    },{
      name: 'User 4',
      amount: 10000,
      image: 'user4.png'
    },{
      name: 'User 5',
      amount: 10000,
      image: 'user5.png'
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('users', null, {});

  }
};
