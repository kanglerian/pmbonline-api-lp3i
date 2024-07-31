'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class School extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  School.init({
    name: {
      type: DataTypes.STRING(255),
      unique: false,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(255),
      unique: false,
      allowNull: true,
    },
    region: {
      type: DataTypes.STRING(255),
      unique: false,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(255),
      unique: false,
      allowNull: true,
    },
    lat: {
      type: DataTypes.STRING(255),
      unique: false,
      allowNull: true,
    },
    lng: {
      type: DataTypes.STRING(255),
      unique: false,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      unique: false,
      allowNull: true,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      unique: false,
      allowNull: true,
      field: 'updated_at'
    }
  }, {
    sequelize,
    modelName: 'School',
    tableName: 'schools',
    freezeTableName: true,
  });
  return School;
};