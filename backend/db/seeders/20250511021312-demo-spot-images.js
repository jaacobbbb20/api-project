"use strict";

const { Spot, SpotImage } = require("../models");

module.exports = {
  async up(queryInterface, Sequelize) {
    const options = {};
    if (process.env.NODE_ENV === "production") {
      options.schema = process.env.SCHEMA;
    }

    const demoSpots = await Spot.findAll(options);

    if (demoSpots.length < 4) {
      throw new Error("Not enough spots to seed images.");
    }

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
        spotId: demoSpots[2].id,
        url: "https://images.pexels.com/photos/7403782/pexels-photo-7403782.jpeg",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: demoSpots[2].id,
        url: "https://images.pexels.com/photos/7403782/pexels-photo-7403782.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: demoSpots[2].id,
        url: "https://www.pexels.com/photo/photo-of-bedroom-1454806/",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: demoSpots[2].id,
        url: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: demoSpots[3].id,
        url: "https://live.staticflickr.com/4123/4895368331_2fdd79262d_c.jpg",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert(
      { tableName: "SpotImages", ...options },
      spotImages
    );
  },

  async down(queryInterface, Sequelize) {
    const options = {};
    if (process.env.NODE_ENV === "production") {
      options.schema = process.env.SCHEMA;
    }
    await queryInterface.bulkDelete(
      { tableName: "SpotImages", ...options },
      null,
      {}
    );
  },
};
