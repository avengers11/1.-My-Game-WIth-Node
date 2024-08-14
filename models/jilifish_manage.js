'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JiliFish_Manage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  JiliFish_Manage.init({
    favicon: DataTypes.STRING,
    logo: DataTypes.STRING,
    game_mod: DataTypes.BOOLEAN,
    game_status: DataTypes.BOOLEAN,
    change_2: DataTypes.INTEGER,
    change_3: DataTypes.INTEGER,
    change_low: DataTypes.INTEGER,
    change_mid: DataTypes.INTEGER,
    change_high: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'JiliFish_Manage',
  });
  return JiliFish_Manage;
};