const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { Review, ReviewImage, User, Spot, SpotImage } = require('../../db/models');

const { validateReview } = require('../../utils/validation');

// GET /api/reviews/current
// Get all Reviews of the Current User
router.get(
  '/current',
  requireAuth,
  async (req, res, next) => {
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
              attributes: ['url', 'preview']
            }
          ]
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    });

    const formattedReviews = reviews.map(review => {
      const spotImages = review.Spot.SpotImages || [];
      const previewImage = spotImages.find(img => img.preview === true)?.url || null;

      return {
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
          previewImage
        },
        ReviewImages: review.ReviewImages
      };
    });

    res.json({ Reviews: formattedReviews });
  }
);

// POST /api/reviews/:reviewId/images
// Add an Image to a Review based on the Review's id
router.post(
  '/:reviewId/images',
  requireAuth,
  async (req, res, next) => {
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
  }
);

// PUT /api/reviews/:reviewId
// Edit a review
router.put(
  '/:reviewId', 
  requireAuth,
  validateReview,
  async (req, res, next) => {
    const { reviewId } = req.params;
    const { review, stars } = req.body;
    const userId = req.user.id;

    // Look for the review
    const existingReview = await Review.findByPk(reviewId);
    if (!existingReview) {
      return res.status(404).json({ 
        message: "Review couldn't be found" 
      });
    }

    // Check if the review belongs to the current user
    if (existingReview.userId !== userId) {
      return res.status(403).json({ 
        message: "Forbidden: Review does not belong to you" 
      });
    }

    // Update the review
    await existingReview.update({ review, stars });
    res.status(200).json({
      id: existingReview.id,
      userId: existingReview.userId,
      spotId: existingReview.spotId,
      review: existingReview.review,
      stars: existingReview.stars,
      createdAt: existingReview.createdAt.toISOString(),
      updatedAt: existingReview.updatedAt.toISOString()
    });
  }
);

// DELETE /reviews/:reviewId
// Delete a review
router.delete(
  '/:reviewId',
  requireAuth,
  async (req, res) => {
    const reviewId = parseInt(req.params.reviewId, 10);  // ✅ Parse to integer
    const userId = req.user.id;

    // Check if reviewId is a valid integer
    if (isNaN(reviewId)) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          id: "Review ID must be a valid integer"
        }
      });
    }

    // Check if the review exists
    const review = await Review.findByPk(reviewId);

    // Return 404 if review is not found
    if (!review) {
      return res.status(404).json({
        message: "Review couldn't be found"
      });
    }

    // Check if the current user owns the review
    if (review.userId !== userId) {
      return res.status(403).json({
        message: "Forbidden: You do not own this review"
      });
    }

    // Delete the review and associated images (CASCADE works automatically)
    await review.destroy();
    return res.status(200).json({ message: "Successfully deleted" });
  }
);

module.exports = router;
