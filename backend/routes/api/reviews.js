const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { Review, ReviewImage, User, Spot, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .withMessage('Stars are required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

// GET /api/reviews/current
// Get all Reviews of the Current User
router.get(
  '/current',
  requireAuth,
  async (req, res, next) => {
    try {
      const reviews = await Review.findAll({
        where: { userId: req.user.id },
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: Spot,
            attributes: [
              'id', 'ownerId', 'address', 'city', 'state',
              'country', 'lat', 'lng', 'name', 'price'
            ],
            include: [
              {
                model: SpotImage,
                attributes: ['url'],
                where: { preview: true },
                required: false
              }
            ]
          },
          {
            model: ReviewImage,
            attributes: ['id', 'url']
          }
        ]
      });
    
      const formattedReviews = reviews.map(review => ({
        id: review.id,
        userId: review.userId,
        spotId: review.spotId,
        review: review.review,
        stars: review.stars,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        User: review.User,
        Spot: {
          id: review.Spot.id,
          ownerId: review.Spot.ownerId,
          address: review.Spot.address,
          city: review.Spot.city,
          state: review.Spot.state,
          country: review.Spot.country,
          lat: review.Spot.lat,
          lng: review.Spot.lng,
          name: review.Spot.name,
          price: review.Spot.price,
          previewImage: review.Spot.SpotImages[0]?.url || null
        },
        ReviewImages: review.ReviewImages
      }));

      res.json({ Reviews: formattedReviews });

    } catch (error) {
      next(error);
    }
  }
);

// GET /api/spots/:spotId/reviews
// Get all reviews by a spot's ID
router.get(
  '/:spotId/reviews', 
  async (req, res, next) => {
    try {
      const spotId = req.params.spotId;

      // Check if the spot exists
      const spot = await Spot.findByPk(spotId);
  
      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }

      // Get the reviews for the spot, which includes User and ReviewImages
      const reviews = await Review.findAll({
        where: { spotId },
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: ReviewImage,
            attributes: ['id', 'url']
          }
        ]
      });
      return res.status(200).json({ Reviews: reviews });
    } catch (error) {
      return next(error);
    }
  }
);

// POST /api/spots/:spotId/reviews
// Create a Review for a Spot based on the Spot's id
router.post(
  '/:spotId/reviews',
  requireAuth,
  validateReview,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const spotId = parseInt(req.params.spotId, 10);
      const { review, stars } = req.body;
    
      // Check to see if the spot even exists
      const spot = await Spot.findByPk(spotId);
      if (!spot) {
        return res.status(404).json({
          message: "Spot couldn't be found"
        });
      }

      // Check to see if the user already left a review for said spot
      const existingReview = await Review.findOne({ where: { spotId, userId } });
      if (existingReview) {
        return res.status(403).json({
          message: 'User already has a review for this spot'
        });
      }

      // Create the actual review
      const newReview = await Review.create({
        userId,
        spotId,
        review,
        stars
      });
      res.status(201).json(newReview);
    } catch (error) {
      return next(error);
    }
  }
);

// POST /api/reviews/:reviewId/images
// Add an Image to a Review based on the Review's id
router.post(
  '/:reviewId/images',
  requireAuth,
  async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const { url } = req.body;
      const userId = req.user.id;

      // Find the review by it's ID
      const review = await Review.findByPk(reviewId);

      if (!review) {
        return res.status(404).json({
          message: "Review couldn't be found"
        });
      }

      // Check if the user is tied to the review
      if (review.userId !== userId) {
        return res.status(403).json({
          message: 'Forbidden: You do not own this review.'
        });
      }

      // Check the current amount of images
      const imagesCount = await ReviewImage.count({ where: { reviewId } });

      if (imagesCount >= 10) {
        return res.status(403).json({
          message: 'Maximum number of images for this resource was reached'
        });
      }

      // Create a new image
      const newImage = await ReviewImage.create({
        reviewId,
        url
      });

      return res.status(201).json({
        id: newImage.id,
        url: newImage.url
      });
    } catch (error) {
      return next(error);
    }
  }
);

// Edit a review
router.put(
  '/:reviewId', 
  requireAuth,
  validateReview,
  async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const { review, stars } = req.body;
      const userId = req.user.id;

      // Look for the review
      const existingReview = await Review.findByPk(reviewId);

      if (!existingReview) {
        return res.status(404).json({ message: "Review couldn't be found" });
      }

      // Check if the review belongs to the current user
      if (existingReview.userId !== userId) {
        return res.status(403).json({ message: "Forbidden: Review does not belong to you" });
      }

      // Update the review
      await existingReview.update({ review, stars });
      res.status(200).json(existingReview);
    
    } catch (error) {
      return next(error);
    }
  }
);

// DELETE /reviews/:reviewId
// Delete a review
router.delete(
  '/:reviewId', 
  requireAuth,
  async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const userId = req.user.id;
      
      // Find the review by its ID
      const review = await Review.findByPk(reviewId);
      
      if (!review) {
        return res.status(404).json({ message: "Review couldn't be found" });
      }

      // Check if the current user owns the review
      if (review.userId !== userId) {
        return res.status(403).json({ message: "Forbidden: Review doesn't belong to the current user" });
      }

      // Delete the review
      await review.destroy();
      return res.status(200).json({ message: "Successfully deleted" });

    } catch (error) {
      return next(error)
    }
  }
);
// DELETE
router.delete('/:reviewId/images/:imageId', requireAuth, async (req, res, next) => {
  const { reviewId, imageId } = req.params;
  const image = await ReviewImage.findByPk(imageId);
  if (!image || image.reviewId.toString() !== reviewId) return res.status(404).json({ message: "Review Image couldn't be found" });
  if (req.user.id !== (await Review.findByPk(reviewId)).userId) return res.status(403).json({ message: "Forbidden" });
  await image.destroy();
  res.json({ message: "Successfully deleted" });
});

module.exports = router;
