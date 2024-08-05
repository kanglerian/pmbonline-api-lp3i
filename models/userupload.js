'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserUpload extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserUpload.belongsTo(models.FileUpload, {
        foreignKey: 'fileuploadId',
        as: 'fileupload'
      });
    }
  }
  UserUpload.init({
    identityUser: {
      type: DataTypes.STRING(50),
      unique: false,
      allowNull: false,
      field: 'identity_user'
    },
    fileuploadId: {
      type: DataTypes.BIGINT(20),
      unique: false,
      allowNull: false,
      field: 'fileupload_id'
    },
    typefile: {
      type: DataTypes.STRING(10),
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
    modelName: 'UserUpload',
    tableName: 'users_upload',
    freezeTableName: true,
  });
  return UserUpload;
};