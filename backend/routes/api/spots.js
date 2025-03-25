const express = require('express');
const { Spot, Review, ReviewImage, User, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { validateSpot } = require('../../utils/validation');
const router = express.Router();

// GET /api/spots — all spots
router.get('/', async (req, res, next) => {
  try {
    const spots = await Spot.findAll({
      include: [
        { model: Review, attributes: ['stars'] },
        { model: SpotImage, attributes: ['url'] }
      ]
    });

    const formatted = spots.map(spot => ({
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
      avgRating: (
        spot.Reviews.reduce((sum, r) => sum + r.stars, 0) /
        (spot.Reviews.length || 1)
      ).toFixed(1),
      previewImage: spot.SpotImages[0]?.url || null
    }));

    return res.json({ Spots: formatted });
  } catch (err) {
    next(err);
  }
});

// GET /api/spots/current — spots owned by current user
router.get('/current', requireAuth, async (req, res, next) => {
   try {
     const rawSpots = await Spot.findAll({
       where: { ownerId: req.user.id },
       attributes: ['id', 'ownerId', 'name'], // ownerId used for WHERE
       include: [{ model: Review, attributes: ['stars'] }, { model: SpotImage, attributes: ['url'] }],
       raw: true,
       nest: true
     });
 
     // Rename ownerID → ownerId
     const Spots = rawSpots.map(s => ({
       id: s.id,
       ownerId: s.ownerID,      // <— use ownerID from raw result
       name: s.name,
       avgRating: (s['Reviews.stars'] || 0).toFixed(1),
       previewImage: s['SpotImages.url'] || null
     }));
 
     return res.json({ Spots });
   } catch (err) {
     next(err);
   }
 });

// GET /api/spots/:spotId/reviews — all reviews for a single spot
router.get('/:spotId/reviews', async (req, res, next) => {
   try {
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
   } catch (err) {
     next(err);
   }
 });
 

// GET /api/spots/:spotId — single spot detail
router.get('/:spotId', async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
});

// POST /api/spots — create new
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
  try {
    const newSpot = await Spot.create({ ownerId: req.user.id, ...req.body });
    return res.status(201).json(newSpot);
  } catch (err) {
    next(err);
  }
});

// PUT /api/spots/:spotId — edit existing
router.put('/:spotId', requireAuth, async (req, res, next) => {
   try {
     const spot = await Spot.findByPk(req.params.spotId);
     if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });
     if (spot.ownerId !== req.user.id) return res.status(403).json({ message: "Forbidden" });
 
     await spot.update(req.body);
     return res.json(spot);
   } catch (err) {
     next(err);
   }
 });
 

// DELETE /api/spots/:spotId — delete
router.delete('/:spotId', requireAuth, async (req, res, next) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });
    if (spot.ownerId !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    await spot.destroy();
    return res.json({ message: "Successfully deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
