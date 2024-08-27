'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Achievement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Achievement.init({
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
    level: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
      field: 'level'
    },
    year: {
      type: DataTypes.DATEONLY,
      unique: false,
      allowNull: true,
      field: 'year'
    },
    result: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
      field: 'result'
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
    modelName: 'Achievement',
    tableName: 'achievements',
    freezeTableName: true,
  });
  return Achievement;
};