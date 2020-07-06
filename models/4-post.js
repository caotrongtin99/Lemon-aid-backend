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
        as: 'postingredients',
        foreignKey: 'postId'
      })
      Post.hasMany(models.PostCategory,{
        as: 'postcategories',
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
    ingredientIds : DataTypes.ARRAY(DataTypes.UUID),
    categoryIds :  DataTypes.ARRAY(DataTypes.UUID),
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};