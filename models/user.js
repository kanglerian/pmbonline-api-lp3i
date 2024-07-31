'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    identity: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING(10),
      unique: true,
      allowNull: true,
    },
    sheet: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING(100),
      unique: false,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(150),
      unique: false,
      allowNull: false,
    },
    gender: {
      type: DataTypes.BOOLEAN,
      unique: false,
      defaultValue: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: true,
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
      unique: false,
      allowNull: true,
      field: 'email_verified_at'
    },
    phone: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: true,
    },
    role: {
      type: DataTypes.CHAR(1),
      unique: false,
      defaultValue: 'S',
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      unique: false,
      allowNull: false,
    },
    rememberToken: {
      type: DataTypes.STRING(100),
      unique: false,
      allowNull: true,
      field: 'remember_token'
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
    modelName: 'User',
    tableName: 'users',
    freezeTableName: true,
  });
  return User;
};