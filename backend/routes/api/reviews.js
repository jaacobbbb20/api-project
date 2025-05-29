const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../utils/auth");
const {
  Review,
  ReviewImage,
  User,
  Spot,
  SpotImage,
} = require("../../db/models");

const { check, validationResult } = require('express-validator');

/* --------------------- */
/*      Validators       */
/* --------------------- */

const validateReviewInput = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorObj = {};
      errors.array().forEach((err) => {
        errorObj[err.path] = err.msg;
      });
      const err = new Error("Bad Request");
      err.errors = errorObj;
      err.status = 400;
      return next(err);
    }
    next();
  },
];

/* --------------------- */
/*        Routes         */
/* --------------------- */

/* GET /api/reviews/current - Get all reviews from the current user */
router.get("/current", requireAuth, async (req, res, next) => {
  const reviews = await Review.findAll({
    where: { userId: req.user.id },
    include: [
      { model: User, attributes: ["id", "firstName", "lastName"] },
      {
        model: Spot,
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "price",
        ],
        include: [{ model: SpotImage, attributes: ["url", "preview"] }],
      },
      { model: ReviewImage, attributes: ["id", "url"] },
    ],
  });

  const formatted = reviews.map((r) => ({
    id: r.id,
    userId: r.userId,
    spotId: r.spotId,
    review: r.review,
    stars: r.stars,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    User: r.User,
    Spot: {
      ...r.Spot.toJSON(),
      previewImage: r.Spot.SpotImages.find((img) => img.preview)?.url || null,
    },
    ReviewImages: r.ReviewImages,
  }));

  res.json({ Reviews: formatted });
});

/* POST /api/reviews/:reviewId/images - Add an image to a review based on the review's id */
router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
  const { reviewId } = req.params;
  const { url } = req.body;
  const userId = req.user.id;

  const review = await Review.findByPk(reviewId);
  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }

  if (review.userId !== userId) {
    return res.status(403).json({
      message: "Forbidden: You do not own this review.",
    });
  }

  const imagesCount = await ReviewImage.count({ where: { reviewId } });
  if (imagesCount >= 10) {
    return res.status(403).json({
      message: "Maximum number of images for this resource was reached",
    });
  }

  const newImage = await ReviewImage.create({
    reviewId,
    url,
  });

  return res.status(201).json({
    id: newImage.id,
    url: newImage.url,
  });
});

/* PUT /api/reviews/:reviewId - Edit a review based on the review's id */
router.put(
  "/:reviewId",
  requireAuth,
  validateReviewInput,
  async (req, res, next) => {
    const { reviewId } = req.params;
    const { review, stars } = req.body;
    const userId = req.user.id;

    const existingReview = await Review.findByPk(reviewId);
    if (!existingReview) {
      return res.status(404).json({
        message: "Review couldn't be found",
      });
    }

    if (existingReview.userId !== userId) {
      return res.status(403).json({
        message: "Forbidden: Review does not belong to you",
      });
    }

    await existingReview.update({ review, stars });

    res.status(200).json({
      id: existingReview.id,
      userId: existingReview.userId,
      spotId: existingReview.spotId,
      review: existingReview.review,
      stars: existingReview.stars,
      createdAt: existingReview.createdAt.toISOString(),
      updatedAt: existingReview.updatedAt.toISOString(),
    });
  }
);

/* DELETE /api/reviews/:reviewId - Delete a review based on the review's id */
router.delete("/:reviewId", requireAuth, async (req, res) => {
  const reviewId = parseInt(req.params.reviewId, 10); // ✅ Parse to integer
  const userId = req.user.id;

  if (isNaN(reviewId)) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        id: "Review ID must be a valid integer",
      },
    });
  }

  const review = await Review.findByPk(reviewId);

  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }

  if (review.userId !== userId) {
    return res.status(403).json({
      message: "Forbidden: You do not own this review",
    });
  }

  await review.destroy();
  return res.status(200).json({
    message: "Successfully deleted",
  });
});

/* DELETE /api/reviews/review-images/:imageId - Deletes a review image based on the image's id */
router.delete(
    '/review-images/:imageId', 
    requireAuth, 
    async (req, res) => {
        const { imageId } = req.params;
        const userId = req.user.id;

        const reviewImage = await ReviewImage.findByPk(imageId, {
            include: { model: Review }
        });

        if (!reviewImage) {
            return res.status(404).json({ message: "Review Image couldn't be found" });
        }

        if (reviewImage.Review.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await reviewImage.destroy();

        return res.status(200).json({
        message: "Successfully deleted"
    });
});

module.exports = router;
