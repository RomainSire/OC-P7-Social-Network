const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../database/testSequelize.db'
});

const User = sequelize.define("user", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pictureurl: DataTypes.STRING,
  outline: DataTypes.STRING,
  isAdmin: {
    type: DataTypes.TINYINT,
    allowNull: false,
    validate: {
      isIn: [[0, 1]],
    }
  }
});

module.exports = {sequelize, User};