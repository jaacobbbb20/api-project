const express = require("express");
const { Op } = require("sequelize");
const { check, validationResult } = require("express-validator");

const { requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");

const { Spot, Review, ReviewImage, User, SpotImage } = require("../../db/models");

const router = express.Router();

/* --------------------- */
/*      Validators       */
/* --------------------- */

const validateSpot = [
  check('address')
     .exists({ checkFalsy: true })
     .withMessage('Street address is required'),
  check('city')
     .exists({ checkFalsy: true })
     .withMessage('City is required'),
  check('state')
     .exists({ checkFalsy: true })
     .withMessage('State is required'),
  check('country')
     .exists({ checkFalsy: true })
     .withMessage('Country is required'),
  check('lat')
     .isFloat({ min: -90, max: 90 })
     .withMessage('Latitude is not valid'),
  check('lng')
     .isFloat({ min: -180, max: 180 })
     .withMessage('Longitude is not valid'),
  check('name')
     .exists({ checkFalsy: true })
     .withMessage('Name must be less than 50 characters')
     .isLength({ max: 50 })
     .withMessage('Name must be less than 50 characters'),
  check('description')
     .exists({ checkFalsy: true })
     .withMessage('Description is required'),
  check('price')
     .exists({ checkFalsy: true })
     .isFloat({ min: 0.01 })
     .withMessage('Price per day is required'),
  handleValidationErrors
];

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
/*   Helper Middleware   */
/* --------------------- */

/* Validates and parses query parameters for GET/api/spots */
function validateQueryParams(req, res, next) {
  let {
    page = "1",
    size = "20",
    minLat,
    maxLat,
    minLng,
    maxLng,
    minPrice,
    maxPrice,
  } = req.query;

  const errors = {};

  const parsedPage = parseInt(page, 10);
  const parsedSize = parseInt(size, 10);

  // Validate page
  if (isNaN(parsedPage) || parsedPage < 1) {
    errors.page = "Page must be greater than or equal to 1";
  }

  // Validate size
  if (isNaN(parsedSize) || parsedSize < 1 || parsedSize > 20) {
    errors.size = "Size must be greater than or equal to 1";
  }

  // Set defaults for page and size
  req.query.page = parsedPage;
  req.query.size = parsedSize;

  // Validate and parse numeric filters (if they exist)
  const filterKeys = [
    "minLat",
    "maxLat",
    "minLng",
    "maxLng",
    "minPrice",
    "maxPrice",
  ];
  for (const key of filterKeys) {
    if (req.query[key] !== undefined) {
      const parsed = parseFloat(req.query[key]);
      if (isNaN(parsed)) {
        errors[key] = getErrorMessage(key); // Custom error messages
      } else if ((key === "minPrice" || key === "maxPrice") && parsed < 0) {
        errors[key] = `${
          key === "minPrice" ? "Minimum" : "Maximum"
        } price must be greater than or equal to 0`;
      }
      req.query[key] = parsed;
    }
  }

  // Return errors if any exist
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors,
    });
  }

  // Proceed to the next middleware if everything is valid
  next();
}

/* Helper function to return custom error messages */
function getErrorMessage(key) {
  switch (key) {
    case "minLat":
      return "Minimum latitude is invalid";
    case "maxLat":
      return "Maximum latitude is invalid";
    case "minLng":
      return "Minimum longitude is invalid";
    case "maxLng":
      return "Maximum longitude is invalid";
    case "minPrice":
      return "Minimum price must be greater than or equal to 0";
    case "maxPrice":
      return "Maximum price must be greater than or equal to 0";
    default:
      return `${key} is invalid`;
  }
}

/* --------------------- */
/*        Routes         */
/* --------------------- */

/* GET /api/spots - Returns all of the spots */
router.get("/", validateQueryParams, async (req, res) => {
  const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;

  const where = {};
  if (minLat !== undefined || maxLat !== undefined) {
    where.lat = {};
    if (minLat !== undefined) where.lat[Op.gte] = minLat;
    if (maxLat !== undefined) where.lat[Op.lte] = maxLat;
  }
  if (minLng !== undefined || maxLng !== undefined) {
    where.lng = {};
    if (minLng !== undefined) where.lng[Op.gte] = minLng;
    if (maxLng !== undefined) where.lng[Op.lte] = maxLng;
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price[Op.gte] = minPrice;
    if (maxPrice !== undefined) where.price[Op.lte] = maxPrice;
  }

  // Page calculation
  const offset = size * (page - 1);
  const limit = size;

  // Query the spots that have associated SpotImages and Reviews
  const spots = await Spot.findAll({
    where,
    include: [
      {
        model: Review,
        attributes: ["stars"],
      },
      {
        model: SpotImage,
        attributes: ["url", "preview"],
        where: { preview: true },
        required: false, // This ensures it doesn't filter out spots without preview images
      },
    ],
    limit,
    offset,
  });

  // Format the result to contain the selected fields and calculate the average rating
  const formatted = spots.map((spot) => {
    const avgRating = (
      spot.Reviews.reduce((sum, r) => sum + r.stars, 0) /
      (spot.Reviews.length || 1)
    ).toFixed(1);

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
      avgRating,
      // Find the preview image or fallback
      previewImage: spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null,
      Owner: spot.Owner,
    };
  });

  return res.json({ Spots: formatted, page, size });
});

// GET /api/spots/current
// Gets the spots owned by the current user
router.get('/current', requireAuth, async (req, res) => {
  const spots = await Spot.findAll({
    where: { ownerId: req.user.id },
    attributes: [
      'id',
      'ownerId',
      'address',
      'city',
      'state',
      'country',
      'lat',
      'lng',
      'name',
      'description',
      'price',
      'createdAt',
      'updatedAt'
    ],
    include: [
      { model: Review, attributes: ['stars'] },
      {
        model: SpotImage,
        attributes: ['url', 'preview']
      }
    ]
  });

  const formattedSpots = spots.map(spot => {
  const avgRating = spot.Reviews.length
    ? (spot.Reviews.reduce((sum, r) => sum + r.stars, 0) / spot.Reviews.length).toFixed(1)
    : null;

  const previewImage = spot.SpotImages.find(img => img.preview)?.url || null;

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
    avgRating,
    previewImage // ✅ just the string
  };
});

  return res.json({ Spots: formattedSpots });
});

// GET /api/spots/:spotId/reviews
// Gets all reviews for a single spot
router.get("/:spotId/reviews", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });

  const reviews = await Review.findAll({
    where: { spotId: req.params.spotId },
    include: [
      { model: User, attributes: ["id", "firstName", "lastName"] },
      { model: ReviewImage, attributes: ["id", "url"] },
    ],
  });

  return res.json({ Reviews: reviews });
});

/* GET /api/spots/:spotId - Gets the info for a specific spot */
router.get("/:spotId", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [
      { model: Review, attributes: ["stars"] },
      { model: SpotImage, attributes: ["url", "preview"] },
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });

  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });

  // Calculate average rating
  const avgRating = (
    spot.Reviews.reduce((sum, r) => sum + r.stars, 0) /
    (spot.Reviews.length || 1)
  ).toFixed(1);

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
    updatedAt: spot.updatedAt,
    avgRating,
    SpotImages: spot.SpotImages.map((img) => ({
      url: img.url,
      preview: img.preview,
    })),
    Owner: spot.Owner,
  });
});

/* POST /api/spots */
router.post("/", requireAuth, validateSpot, async (req, res, next) => {
  const newSpot = await Spot.create({ ownerId: req.user.id, ...req.body });
  return res.status(201).json(newSpot);
});

// PUT /api/spots/:spotId
// Editing a specific existing spot
router.put("/:spotId", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });
  if (spot.ownerId !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });

  await spot.update(req.body);
  return res.json(spot);
});

// DELETE /api/spots/:spotId
// Deletes a spot
router.delete("/:spotId", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });
  if (spot.ownerId !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });

  await spot.destroy();
  return res.json({ message: "Successfully deleted" });
});

// POST api/spots
// Add an image to a spot by it's ID
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { url, preview } = req.body;
  const { spotId } = req.params;
  const userId = req.user.id;

  if (!url || typeof url !== "string" || url.trim() === "") {
    return res.status(400).json({ message: "Image URL is required and must be a non-empty string" });
  }

  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== userId) {
    return res
      .status(403)
      .json({ message: "Forbidden: You are not the owner of this spot" });
  }

  const newImage = await SpotImage.create({
    spotId,
    url,
    preview,
  });

  return res.status(201).json({
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview,
  });
});

// POST /api/spots/:spotId/reviews
// Create a Review for a Spot based on the Spot's id
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReviewInput,
  async (req, res, next) => {
    const userId = req.user.id;
    const spotId = parseInt(req.params.spotId, 10);
    const { review, stars } = req.body;

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    const existingReview = await Review.findOne({ where: { spotId, userId } });
    if (existingReview) {
      return res.status(500).json({
        message: "User already has a review for this spot",
      });
    }

    const newReview = await Review.create({
      userId,
      spotId,
      review,
      stars,
    });

    return res.status(201).json({
      id: newReview.id,
      userId: newReview.userId,
      spotId: newReview.spotId,
      review: newReview.review,
      stars: newReview.stars,
      createdAt: newReview.createdAt,
      updatedAt: newReview.updatedAt,
    });
  }
);

// DELETE /api/spots/:spotId/images
// Deletes all images for a specific spot
router.delete("/:spotId/images", requireAuth, async (req, res) => {
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await SpotImage.destroy({
    where: { spotId }
  });

  return res.json({ message: "All images deleted for this spot" });
});


module.exports = router;