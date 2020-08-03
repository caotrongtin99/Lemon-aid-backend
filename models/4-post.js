'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.belongsTo(models.User,{
        foreignKey :'userId'
      })
      Post.hasMany(models.Comment,{
        foreignKey: 'postId'
      })
      Post.hasMany(models.PostLike,{
        as: 'postlike',
        foreignKey: 'postId'
      })
      Post.hasMany(models.SavedPost,{
        as: 'savedposts',
        foreignKey: 'postId'
      })
      Post.hasMany(models.Step, {
        foreignKey: 'postId'
      })
    }
  };
  Post.init({
    id : {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    ration: DataTypes.STRING,
    cookingTime : DataTypes.INTEGER,
    difficultLevel: DataTypes.INTEGER,
    url: DataTypes.STRING,
    avatar: DataTypes.TEXT,
    content: DataTypes.TEXT,
    ingredients : DataTypes.STRING,
    categories: DataTypes.STRING,
    hashtags : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};