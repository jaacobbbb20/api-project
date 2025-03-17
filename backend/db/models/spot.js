'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Spot.belongsTo(models.User, { foreignKey: 'ownerId', as: 'Owner' });

      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId' });

      Spot.hasMany(models.Review, { foreignKey: 'spotId' });

      Spot.hasMany(models.Booking, { foreignKey: 'spotId' });
    }
  }
  Spot.init({
    ownerId: { // Use "ownerId" instead of "ownerID" for consistency
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: { min: -90, max: 90 },
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: { min: -180, max: 180 },
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: { len: [1, 50] },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0.01,
      },
    },
  }, {
    sequelize,
    modelName: 'Spot',
    tableName: 'Spots',
    timestamps: true,
  });
  return Spot;
};