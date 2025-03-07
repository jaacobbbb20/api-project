'use strict';
const { User, sequelize } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // This defines the schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demouser@demo.org',
        username: 'demo-dude',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'demouser2@demo.org',
        username: 'demo-gal',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'demouser3@demo.org',
        username: 'demo-dawg',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['demo-dude', 'demo-gal', 'demo-dawg'] }
    }, {});
  }
};
