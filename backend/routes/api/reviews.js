const express = require('express');
const { Review, ReviewImage, User, Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check, handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const router = express.Router();

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

