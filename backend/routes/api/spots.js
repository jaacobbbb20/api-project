const express = require('express');
const { Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require ('../../utils/validation');
const { Op } = require('sequelize');

const router = express.Router();

// Spot Validations
const validateSpot = [
   check('address')
      .exists({ checkFalsy: true })
      .withMessage('Street address is required'),
   check('city')
      .exists({ checkFalsy: true })
      .withMessage('city is required'),
   check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
   check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
   check('lat')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be within -90 and 90'),
   check('lng')
      .isFloat({ min: -100, max: 100 })
      .withMessage('Longitude must be within -180 and 180'),
   check('name')
      .exists({ checkFalsy: true })
      .withMessage('Name is required')
      .isLength({ max: 50 })
      .withMessage('Name must be less than 50 characters'),
   check('description')
      .exists({ checkFalsy: true })
      .withMessage('Description is required'),
   check('price')
      .exists({ gt: 0 })
      .withMessage('Price per day must be a positive number'),
   
   handleValidationErrors
];

// Create a Spot
router.post(
   '/',
   requireAuth,
   validateSpot,
   async (req, res, next) => {
      try {
         const { address, city, state, country, lat, lng, name, description, price } = req.body;
         const newSpot = await Spot.create({
            ownerId: req.user.id,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
         });
         return res.status(201).json(newSpot);
      } catch (error) {
         next(error);
      }
   }
);

// Delete a Spot Image
   // DELETE /spots/:spotId/images/:imageId

module.exports = router;