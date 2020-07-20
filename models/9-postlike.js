'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PostLike.belongsTo(models.Post,{
        as:'post',
        foreignKey:'postId'
      });
      PostLike.belongsTo(models.User,{
        as:'postlike',
        foreignKey:'userId'
      })
    }
  };
  PostLike.init({
    number: DataTypes.INTEGER,
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
    modelName: 'PostLike',
  });
  return PostLike;
};