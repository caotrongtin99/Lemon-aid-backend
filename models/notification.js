'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notification.belongsTo(models.User,{
        as : 'notificationSender',
        foreignKey:'senderId'
      });
      Notification.belongsTo(models.User,{
        as : 'notificationReceiver',
        foreignKey:'receiverId'
      });
      Notification.belongsTo(models.PostLike,{
        as : 'likeAction',
        foreignKey:'like'
      });
      Notification.belongsTo(models.Follower,{
        as : 'followAction',
        foreignKey:'follow'
      });
      Notification.belongsTo(models.Comment,{
        as : 'commentAction',
        foreignKey:'comment'
      });
    }
  };
  Notification.init({
    action: DataTypes.STRING,
    senderId : {
      type : DataTypes.UUID,
      references : {
         model : 'Users',
         key :'id'
       }
    },
    receiverId : {
      type : DataTypes.UUID,
      references : {
         model : 'Users',
         key :'id'
       }
    },
    like: {
      type : DataTypes.INTEGER,
      references : {
         model : 'PostLikes',
         key :'id'
       }
    },
    follow: {
      type : DataTypes.UUID,
      references : {
         model : 'Followers',
         key :'id'
       }
    },
    comment: {
      type : DataTypes.INTEGER,
      references : {
         model : 'Comments',
         key :'id'
       }
    },
    isSeen : {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};