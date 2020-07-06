'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PostCategory.belongsTo(models.Post,{
        as:'posts',
        foreignKey:'postId'
      });
      PostCategory.belongsTo(models.Category,{
        as:'categories',
        foreignKey:'categoryId'
      })
    }
  }
  
  PostCategory.init({
    quantity: DataTypes.STRING,
    categoryId : {
      type : DataTypes.UUID,
      references : {
         model : 'Categories',
         key :'id'
       }
    },
    postId : {
      type : DataTypes.INTEGER,
      references : {
         model : 'Posts',
         key :'id'
       }
    },
  }, {
    sequelize,
    modelName: 'PostCategory',
  });
  return PostCategory;
};