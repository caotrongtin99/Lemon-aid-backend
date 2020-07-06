'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostIngredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PostIngredient.belongsTo(models.Post,{
        as:'posts',
        foreignKey:'postId'
      });
      PostIngredient.belongsTo(models.Ingredient,{
        as:'ingredients',
        foreignKey:'ingredientId'
      })
    }
  };
  PostIngredient.init({
    quantity: DataTypes.STRING,
    ingredientId : {
      type : DataTypes.UUID,
      references : {
         model : 'Ingredients',
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
    modelName: 'PostIngredient',
  });
  return PostIngredient;
};