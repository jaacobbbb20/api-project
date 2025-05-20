'use strict';

const { User, Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
options.tableName = 'Spots';

module.exports = {
  async up(queryInterface, Sequelize) {
    const demoUser = await User.findOne({
      where: { username: 'Demo-lition' },
      ...options // ensure schema-scoped in production
    });

    if (!demoUser) throw new Error("Demo-lition user not found. Seed Users first!");

    const spots = [
      {
        ownerId: demoUser.id,
        address: '123 Dark Oak Street',
        city: 'Renton',
        state: 'WA',
        country: 'USA',
        lat: 37.7897,
        lng: -122.3942,
        name: 'Woodland Mansion',
        description: "Spacious, and wide open space in the heart of the Dark Oak Forest",
        price: 200,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: demoUser.id,
        address: '456 Mystery Street',
        city: "I don't Know",
        state: 'CA',
        country: 'USA',
        lat: 34.0522,
        lng: -118.2437,
        name: 'Mystery Place',
        description: 'I do not know what this place is or where it is',
        price: 150,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: demoUser.id,
        address: '789 Mountain Rd',
        city: 'Phoenix',
        state: 'AZ',
        country: 'USA',
        lat: 39.7392,
        lng: -104.9903,
        name: 'Lakeside House',
        description: 'Spacious lakeside house with a place to get in your kayak, watch the sunset, and have fun!',
        price: 180,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: demoUser.id,
        address: '123 Sesame Street',
        city: "Elmo",
        state: 'CA',
        country: 'USA',
        lat: 34.0522,
        lng: -118.2437,
        name: "Oscar's Trash Can",
        description: 'Stay in the iconic location Oscar the Grouch stayed in!',
        price: 150,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    return queryInterface.bulkInsert(options, spots, {});
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Woodland Mansion', 'Mystery Place', 'Lakeside House', "Oscar's Trash Can"] }
    }, {});
  }
};
