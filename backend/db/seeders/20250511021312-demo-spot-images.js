'use strict';

const { Spot, SpotImage } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const demoSpots = await Spot.findAll();

    const spotImages = [
      {
        spotId: demoSpots[0].id,
        url: "https://images.pexels.com/photos/8111636/pexels-photo-8111636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: demoSpots[1].id,
        url: "https://images.pexels.com/photos/1690800/pexels-photo-1690800.jpeg",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: demoSpots[2].id,
        url: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: demoSpots[3].id,
        url: "https://live.staticflickr.com/4123/4895368331_2fdd79262d_c.jpg",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    await queryInterface.bulkInsert('SpotImages', spotImages);

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SpotImages', null, {});
  }
};
