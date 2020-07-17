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
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: {
      type: DataTypes.STRING,
      defaultValue: "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
    },
    email: {
      type: DataTypes.STRING,
      unique :true
    },
    token: DataTypes.STRING,
    resetToken : DataTypes.STRING,
    expireToken : DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};