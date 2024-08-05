'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FileUpload extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FileUpload.hasMany(models.UserUpload, {
        foreignKey: 'fileuploadId',
        as: 'users'
      });
    }
  }
  FileUpload.init({
    name: {
      type: DataTypes.STRING(150),
      unique: false,
      allowNull: false,
    },
    namefile: {
      type: DataTypes.STRING(150),
      unique: false,
      allowNull: false,
    },
    accept: {
      type: DataTypes.STRING(150),
      unique: false,
      allowNull: false,
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
    modelName: 'FileUpload',
    tableName: 'file_upload',
    freezeTableName: true,
  });
  return FileUpload;
};