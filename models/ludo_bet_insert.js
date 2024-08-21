'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ludo_Bet_Insert extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ludo_Bet_Insert.init({
    user_id: DataTypes.INTEGER,
    board_id: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    board_number: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Ludo_Bet_Insert',
  });
  return Ludo_Bet_Insert;
};