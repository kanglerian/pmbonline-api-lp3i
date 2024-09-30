'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ApplicantStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ApplicantStatus.hasMany(models.Applicant, {
        foreignKey: 'statusId',
        as: 'applicant'
      });
    }
  }
  ApplicantStatus.init({
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
    modelName: 'ApplicantStatus',
    tableName: 'applicants_status',
    freezeTableName: true,
  });
  return ApplicantStatus;
};