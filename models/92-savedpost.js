'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SavedPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SavedPost.belongsTo(models.Post,{
        as:'savedposts',
        foreignKey:'postId'
      });
      SavedPost.belongsTo(models.User,{
        as:'user1',
        foreignKey:'userId'
      })
    }
  };
  SavedPost.init({
    userId: {
      type : DataTypes.UUID,
      references : {
         model : 'Users',
         key :'id'
       }
    },
    postId : {
      type : DataTypes.UUID,
      references : {
         model : 'Posts',
         key :'id'
       }
    },
  }, {
    sequelize,
    modelName: 'SavedPost',
  });
  return SavedPost;
};