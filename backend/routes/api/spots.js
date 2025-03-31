const express = require('express');
const { Op } = require('sequelize');
const { Spot, Review, ReviewImage, User, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { validateSpot } = require('../../utils/validation');
const router = express.Router();

// Middleware: Validates and parses query parameters for GET/api/spots
function validateQueryParams(req,res, next) {
  let { page = '1', size = '20', minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  // Parses the page and size
  const parsedPage = parseInt(page, 10);
  const parsedSize = parseInt(size, 10);
  if (isNaN(parsedPage) || parsedPage < 1) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: { page: 'Page must be an integer greater than or equal to 1' }
    });
  }
  if (isNaN(parsedSize) || parsedSize < 1) {
    return res.status(400).json({
      message: "Validation Error",
      errors: { size: "Size must be an integer greater than or equal to 1" }
    });
  }
  req.query.page = parsedPage;
  req.query.size = parsedSize;

  // Validates and parses the numeric filters (If they are being used)
  const filterKeys = ['minLat', 'maxLat', 'minLng', 'maxLng', 'minPrice', 'maxPrice'];
  for (const key of filterKeys) {
    if (req.query[key] !== undefined) {
      const parsed = parseFloat(req.query[key]);
      if (isNaN(parsed)) {
        return res.status(400).json({
          message: "Validation Error",
          errors: { [key]: `${key} must be a number` }
        });
      }
      req.query[key] = parsed;
    }
  }
  next();
}

// GET /api/spots
// Filters spots with pages using the middleware function above this route
router.get('/', validateQueryParams, async (req, res) => {
  const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  // Code for a dynamic 'where' clause for the filters
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
      { model: Review, attributes: ['stars'] },
      { model: SpotImage, attributes: ['url'] }
    ],
    limit, 
    offset
  });

  // Format the result to contain the selected fields and calculate the average rating 
  const formatted = spots.map(spot => {
    const avgRating = (spot.Reviews.reduce((sum,  r) => sum + r.stars, 0) /
      (spot.Reviews.length || 1)).toFixed(1);
    
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
      previewImage: spot.SpotImages[0]?.url || null
    };
  });

  return res.json({ Spots: formatted, page, size });
});

// GET /api/spots/current
// Gets the spots owned by the current user
router.get('/current', requireAuth, async (req, res) => {
  const rawSpots = await Spot.findAll({
    where: { ownerId: req.user.id },
    attributes: ['id', 'ownerId', 'name'], // ownerId used for WHERE
    include: [
      { model: Review, attributes: ['stars'] }, 
      { model: SpotImage, attributes: ['url'] }
    ],
      raw: true,
      nest: true
    });
 
  // Rename ownerID → ownerId
  const Spots = rawSpots.map(s => ({
    id: s.id,
    ownerId: s.ownerID,
    name: s.name,
    avgRating: (s['Reviews.stars'] || 0).toFixed(1),
    previewImage: s['SpotImages.url'] || null
  }));
 
  return res.json({ Spots });  
});

// GET /api/spots/:spotId/reviews
// Gets all reviews for a single spot
router.get('/:spotId/reviews', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });
 
  const reviews = await Review.findAll({
    where: { spotId: req.params.spotId },
      include: [
        { model: User, attributes: ['id','firstName','lastName'] },
        { model: ReviewImage, attributes: ['id','url'] }
      ]
    });
 
     return res.json({ Reviews: reviews });
 });
 

// GET /api/spots/:spotId
// Gets the info for a specific spot
router.get('/:spotId', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [
      { model: Review, attributes: ['stars'] },
      { model: SpotImage, attributes: ['url', 'preview'] }
    ]
  });
  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });

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
    SpotImages: spot.SpotImages.map(img => ({ url: img.url, preview: img.preview }))
  });
});

// POST /api/spots
// Creates a new spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
  const newSpot = await Spot.create({ ownerId: req.user.id, ...req.body });
  return res.status(201).json(newSpot);
});

// PUT /api/spots/:spotId
// Editing a specific existing spot
router.put('/:spotId', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });
  if (spot.ownerId !== req.user.id) return res.status(403).json({ message: "Forbidden" });
 
  await spot.update(req.body);
  return res.json(spot);
});
 

// DELETE /api/spots/:spotId 
// Deletes a spot
router.delete('/:spotId', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });
  if (spot.ownerId !== req.user.id) return res.status(403).json({ message: "Forbidden" });

  await spot.destroy();
  return res.json({ message: "Successfully deleted" });
});

module.exports = router;
