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
      Post.hasMany(models.PostIngredient,{
        as: 'postingredient',
        foreignKey: 'postId'
      })
      Post.hasMany(models.PostCategory,{
        as: 'postcategory',
        foreignKey: 'postId'
      })
      Post.hasMany(models.PostLike,{
        as: 'postlike',
        foreignKey: 'postId'
      })
    }
  };
  Post.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    url: DataTypes.STRING,
    avatar: DataTypes.STRING,
    content: DataTypes.STRING,
    tag: DataTypes.STRING,
    ingredients : DataTypes.STRING,
    categories: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};