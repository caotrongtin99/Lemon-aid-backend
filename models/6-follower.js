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
      Follower.belongsTo(models.User,{
        as : 'users',
        foreignKey:'userId'
      });
      Follower.belongsTo(models.User,{
        as : 'users1',
        foreignKey:'followerId'
      });
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
      references : {
         model : 'Users',
         key :'id'
       }
    },
    followerId : {
      type : DataTypes.UUID,
      references : {
         model : 'Users',
         key :'id'
       }
    },
  }, {
    sequelize,
    modelName: 'Follower',
  });
  return Follower;
};