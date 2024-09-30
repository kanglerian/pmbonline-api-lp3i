'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SourceSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SourceSetting.hasMany(models.Applicant, {
        foreignKey: 'sourceId',
        as: 'applicant'
      });
      SourceSetting.hasMany(models.Applicant, {
        foreignKey: 'sourceDaftarId',
        as: 'sourcedaftarsetting'
      });
    }
  }
  SourceSetting.init({
    name: {
      type: DataTypes.STRING(100),
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
    modelName: 'SourceSetting',
    tableName: 'source_setting',
    freezeTableName: true,
  });
  return SourceSetting;
};