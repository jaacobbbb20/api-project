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
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'ownerID'
    },    
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Street address is required"
        }
      },
    },    
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "City is required"
        }
      },
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "State is required"
        }
      },
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Country is required"
        }
      },
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: {
          args: [-90],
          msg: "Latitude is not valid"
        },
        max: {
          args: [90],
          msg: "Latitude is not valid"
        }
      },
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: {
          args: [-180],
          msg: "Longitude is not valid"
        },
        max: {
          args: [180],
          msg: "Longitude is not valid"
        }
      },
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: {
          args: [1, 50],
          msg: "Name must be less than 50 characters"
        }
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Description is required"
        }
      },
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "Price per day is required"
        },
        min: {
          args: [0.01],
          msg: "Price per day is required"
        }
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