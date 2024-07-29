'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ApplicantFamily extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ApplicantFamily.init({
    identity_user: {
      type: DataTypes.STRING(36),
      unique: false,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      unique: false,
      allowNull: true,
    },
    job: {
      type: DataTypes.STRING(150),
      unique: false,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      unique: false,
      allowNull: true,
    },
    gender: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    placeOfBirth: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
      field: 'place_of_birth'
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      unique: false,
      allowNull: true,
      field: 'date_of_birth'
    },
    education: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
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
    modelName: 'ApplicantFamily',
    tableName: 'applicants_family',
    freezeTableName: true,
  });
  return ApplicantFamily;
};