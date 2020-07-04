'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Follower extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Follower.belongsTo(models.User,{
      //   as : 'users',
      //   foreignKey:'userId'
      // });
    }
  };
  Follower.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    relation: DataTypes.STRING,
    userId : {
      type : DataTypes.UUID,
      // references : {
      //   model : 'users',
      //   key :'id'
      // }
    },
    followerId : DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Follower',
  });
  return Follower;
};