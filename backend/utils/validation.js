const { check, validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors.array().forEach(error => {
      errors[error.path] = error.msg;
    });
    
    return res.status(400).json({
      message: "Bad Request",
      errors
    });
  }

  next();
};

// Spot Validations
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

// Signup Validations
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Username is required'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First Name is required'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last Name is required'),
  handleValidationErrors
];

// Login Validations
const validateLogin = [
   check('credential')
      .exists({ checkFalsy: true })
     .withMessage('Please provide a valid email or username.'),
   check('password')
     .exists({ checkFalsy: true })
     .withMessage('Please provide a password.'),
   handleValidationErrors
];

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

module.exports = {
  handleValidationErrors,
  validateSpot,
  validateSignup,
  validateLogin,
  validateReview
};