const express = require('express');
const { Spot, Review, SpotImage } = require('../../db/models');
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

// Edit a Spot
router.put(
   '/:spotId',
   requireAuth,
   async (req, res, next) => {
      try {
         const spotId = req.params.spotId;
         const {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
         } = req.body;

         const errors = {};
         if (!address || address.trim() === '') errors.address = 'Street address is required';
         if (!city || city.trim() === '') errors.city = 'City is required';
         if (!state || state.trim() === '') errors.state = 'State is required';
         if (!country || country.trim() === '') errors.country = 'Country is required'
         if (lat === undefined || isNaN(lat)) errors.lat = 'Latitude must be a valid number';
         if (lng === undefined || isNaN(lat)) errors.lng = 'Longitude must be a valid number';
         if (!name || name.trim() === '') errors.name = 'Name is required';
         if (!description || description.trim() === '') errors.description = 'Description is required';
         if (price === undefined || isNaN(price)) errors.price = 'Price must be a valid number';

         // Validation error?? Spit out 400 response
         if (Object.keys(errors).length > 0) {
            return res.status(400).json({
               message: 'Validation error',
               errors
            });
         }

         // Find the spot via the spot's id
         const spot = await Spot.findByPk(spotId);

         // No spot?? Spit out a 404 response
         if (!spot) {
            return res.status(404).json({
               message: 'Spot could not be found'
            });
         }

         // Make sure that the current user owns the spot
         if (spot.ownerId !== req.user.id) {
            return res.status(403).json({
               message: 'Forbidden: You shall not edit this spot'
            });
         }

         // Update the spot with new inputs
         spot.address = address;
         spot.city = city;
         spot.state = state;
         spot.country = country;
         spot.lat = lat;
         spot.lng = lng;
         spot.name = name;
         spot.description = description;
         spot.price = price;

         // Save the new inputs for the spot to the database
         await spot.save();

         // Return the updated spot data
         return res.json({
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt
         });
      } catch (err) {
        next(err);
      }
   }
);

// Delete a Spot
router.delete(
   '/:spotId',
   requireAuth,
   async (req, res) => {
      const spotId = req.params.spotId;
      const userId = req.user.id;

      try {
         const spot = await Spot.findbyPk(spotId);

         // Spot doesn't exist?? Return a 404
         if (!spot) {
            return res.status(404).json({
               message: 'Spot not found.'
            });
         }

         // Current user doesn't own the spot?? Return a 403
         if (spot.ownerId !== userId) {
            return res.status(403).json({
               message: 'You are not allowed to delete this spot.'
            });
         }

         // Actually deletes the spot
         await spot.destroy();

         // Spot deleted successfully? Return a 200
         return res.status(200).json({
            message: 'Spot successfully deleted.'
         });
      } catch (error) {
         console.error(error);
         return res.status(500).json({
            message: 'Internal server error.'
         });
      }
   }
)

// Get all spots owned by the current User
router.get (
   '/current',
   requireAuth,
   async (req, res) => {
      const userId = req.user.id;

      const spots = await Spot.findAll({
         where: { 
            ownerId: userId
         },
         include: [
            { model: Review },
            { model: SpotImage }
         ]
      });

      const formattedSpots = spots.map(spot => {
         const avgRating = spot.Reviews.reduce((sum, review) => sum + review.stars, 0) / (spot.Reviews.length || 1);
         const previewImage = spot.SpotImages.length ? spot.SpotImages[0].url : null;

         return {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating: avgRating.toFixed(1),
            previewImage: previewImage
         };
      });
      res.status(200).json({Spots: formattedSpots });
   }
);

module.exports = router;