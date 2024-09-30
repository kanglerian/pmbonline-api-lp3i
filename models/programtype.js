'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProgramType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProgramType.hasMany(models.Applicant, {
        foreignKey: 'programtypeId',
        as: 'applicant'
      });
    }
  }
  ProgramType.init({
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
    modelName: 'ProgramType',
    tableName: 'program_type',
    freezeTableName: true,
  });
  return ProgramType;
};