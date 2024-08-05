'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Applicant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Applicant.belongsTo(models.School, {
        foreignKey: 'school',
        as: 'schools'
      });
    }
  }
  Applicant.init({
    identity: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    pmb: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
    },
    nik: {
      type: DataTypes.STRING(16),
      unique: true,
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
      allowNull: true,
    },
    religion: {
      type: DataTypes.STRING(100),
      unique: false,
      allowNull: true,
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
    address: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      unique: false,
      allowNull: true,
      field: 'date_of_birth'
    },
    socialMedia: {
      type: DataTypes.STRING(100),
      unique: false,
      allowNull: true,
      field: 'social_media'
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: true,
    },
    education: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
    },
    major: {
      type: DataTypes.STRING(100),
      unique: false,
      allowNull: true,
    },
    class: {
      type: DataTypes.STRING(100),
      unique: false,
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: true,
    },
    achievement: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    kip: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: true,
    },
    nisn: {
      type: DataTypes.STRING(10),
      unique: true,
      allowNull: true,
    },
    schoolarship: {
      type: DataTypes.BOOLEAN,
      unique: false,
      defaultValue: false,
      allowNull: false,
    },
    scholarshipDate: {
      type: DataTypes.DATE,
      unique: false,
      allowNull: true,
      field: 'scholarship_date'
    },
    note: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    relation: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    identityUser: {
      type: DataTypes.STRING(50),
      unique: false,
      allowNull: false,
      field: 'identity_user'
    },
    program: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
    },
    programSecond: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
      field: 'program_second'
    },
    isread: {
      type: DataTypes.BOOLEAN,
      unique: false,
      defaultValue: false,
      allowNull: false,
    },
    come: {
      type: DataTypes.BOOLEAN,
      unique: false,
      defaultValue: false,
      allowNull: false,
    },
    isApplicant: {
      type: DataTypes.BOOLEAN,
      unique: false,
      defaultValue: false,
      allowNull: false,
      field: 'is_applicant'
    },
    isDaftar: {
      type: DataTypes.BOOLEAN,
      unique: false,
      defaultValue: false,
      allowNull: false,
      field: 'is_daftar'
    },
    isRegister: {
      type: DataTypes.BOOLEAN,
      unique: false,
      defaultValue: false,
      allowNull: false,
      field: 'is_register'
    },
    known: {
      type: DataTypes.BOOLEAN,
      unique: false,
      defaultValue: false,
      allowNull: false,
    },
    planning: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
    },
    otherCampus: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
      field: 'other_campus'
    },
    incomeParent: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
      field: 'income_parent'
    },
    sourceDaftarId: {
      type: DataTypes.BIGINT,
      unique: false,
      allowNull: true,
      field: 'source_daftar_id'
    },
    school: {
      type: DataTypes.BIGINT,
      unique: false,
      allowNull: true,
    },
    followupId: {
      type: DataTypes.BIGINT,
      unique: false,
      allowNull: true,
      field: 'followup_id'
    },
    programtypeId: {
      type: DataTypes.BIGINT,
      unique: false,
      allowNull: true,
      field: 'programtype_id'
    },
    sourceId: {
      type: DataTypes.BIGINT,
      unique: false,
      allowNull: true,
      field: 'source_id'
    },
    statusId: {
      type: DataTypes.BIGINT,
      unique: false,
      allowNull: true,
      field: 'status_id'
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
    modelName: 'Applicant',
    tableName: 'applicants',
    freezeTableName: true,
  });
  return Applicant;
};