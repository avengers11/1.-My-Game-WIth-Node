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
    await queryInterface.bulkInsert('Users', [
      {
        name: 'User 1',
        amount: 10000,
        image: 'http://localhost:3000/assets/general/users/user1.png',
        role: 0
      },{
        name: 'User 2',
        amount: 10000,
        image: 'http://localhost:3000/assets/general/users/user2.png',
        role: 0
      },{
        name: 'User 3',
        amount: 10000,
        image: 'http://localhost:3000/assets/general/users/user3.png',
        role: 0
      },{
        name: 'User 4',
        amount: 10000,
        image: 'http://localhost:3000/assets/general/users/user4.png',
        role: 0
      },{
        name: 'User 5',
        amount: 10000,
        image: 'http://localhost:3000/assets/general/users/user5.png',
        role: 0
      },{
        name: 'Admin',
        amount: 1000000000,
        image: 'http://localhost:3000/assets/general/users/user1.png',
        username: 'vudoolive',
        password: '00000000',
        role: 1
      }
    ], {});
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
