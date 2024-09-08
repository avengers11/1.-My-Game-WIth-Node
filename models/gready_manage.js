'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class gready_manage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  gready_manage.init({
    favicon: DataTypes.STRING,
    logo: DataTypes.STRING,
    game_mod: DataTypes.BOOLEAN,
    game_status: DataTypes.BOOLEAN,
    next_win: DataTypes.INTEGER,

    change_low: DataTypes.INTEGER,
    change_mid: DataTypes.INTEGER,
    change_high: DataTypes.INTEGER,

    win5x: DataTypes.INTEGER,
    win10x: DataTypes.INTEGER,
    win15x: DataTypes.INTEGER,
    win25x: DataTypes.INTEGER,
    win45x: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'gready_manage',
  });
  return gready_manage;
};