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
        as : 'user',
        foreignKey : 'userId'
      });

      User.hasMany(models.Follower, {
        as : 'follower',
        foreignKey : 'userId'
      });

      User.hasMany(models.Post,{
        foreignKey: 'userId'
      })
      User.hasMany(models.Comment,{
        foreignKey: 'userId'
      })
      User.hasMany(models.PostLike,{
        as: 'postlike',
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
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};