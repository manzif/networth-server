const moment = require('moment');
const bcrypt = require('bcrypt');
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * */
     
     await queryInterface.bulkInsert('Users', [{
      firstname: "Manzi",
      lastname: "Fabrice",
      username: "manzif6",
      email: "manzif60@gmail.com",
      password: bcrypt.hashSync('123456', 8),
      role: "admin",
      createdAt: moment.utc().format(),
      updatedAt: moment.utc().format()
     }], {});
    
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * */
    await queryInterface.bulkDelete('Users', null, {});
     
  }
};
