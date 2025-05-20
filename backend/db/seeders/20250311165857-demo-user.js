"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Users";

    await queryInterface.bulkInsert(
      options,
      [
        {
          email: "demo@user.io",
          firstName: "Demo",
          lastName: "User",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "user1@user.io",
          firstName: "Fake",
          lastName: "UserA",
          username: "FakeUser1",
          hashedPassword: bcrypt.hashSync("password2"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "user2@user.io",
          firstName: "Demo",
          lastName: "UserB",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password3"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: { [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2"] },
      },
      options
    );
  },
};
