'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Organization.init({
    identityUser: {
      type: DataTypes.STRING(50),
      unique: false,
      allowNull: false,
      field: 'identity_user'
    },
    name: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
      field: 'name'
    },
    position: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
      field: 'position'
    },
    year: {
      type: DataTypes.DATEONLY,
      unique: false,
      allowNull: true,
      field: 'year'
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
    modelName: 'Organization',
    tableName: 'organizations',
    freezeTableName: true,
  });
  return Organization;
};