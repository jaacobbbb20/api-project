'use strict';

const { User, Spot, SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Find the demo user
    const demoUser = await User.findOne({ where: { username: 'Demo-lition' } });

    // Create three sample spots
    const spots = await Promise.all([
      Spot.create({
        ownerId: demoUser.id,
        address: '123 Dark Oak Street',
        city: 'Minecraft',
        state: 'MC',
        country: 'USA',
        lat: 37.7897,
        lng: -122.3942,
        name: 'Woodland Mansion',
        description: "Spacious, and wide open space in the heart of the Dark Oak Forest",
        price: 200
      }),
      Spot.create({
        ownerId: demoUser.id,
        address: '456 Mystery Street',
        city: "I don't Know",
        state: 'CA',
        country: 'USA',
        lat: 34.0522,
        lng: -118.2437,
        name: 'Mystery Place',
        description: 'I do not know what this place is or where it is',
        price: 150
      }),
      Spot.create({
        ownerId: demoUser.id,
        address: '789 Mountain Rd',
        city: 'Denver',
        state: 'CO',
        country: 'USA',
        lat: 39.7392,
        lng: -104.9903,
        name: 'Mountain View',
        description: 'Peaceful mountain escape with stunning vistas.',
        price: 180
      })
    ]);
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
