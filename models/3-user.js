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
      User.hasMany(models.Follower, {
        as : 'followers',
        foreignKey : 'userId'
      });

      User.hasMany(models.Follower, {
        as : 'followers1',
        foreignKey : 'userId'
      });

      User.hasMany(models.Post,{
        foreignKey: 'userId'
      })
      User.hasMany(models.Comment,{
        foreignKey: 'userId'
      })
    }
  };
  User.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    email: DataTypes.STRING,
    token: DataTypes.STRING,
    followingIds: DataTypes.ARRAY(DataTypes.UUID) ,
    followerIds: DataTypes.ARRAY(DataTypes.UUID) ,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};