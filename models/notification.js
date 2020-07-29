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
        as : 'sender',
        foreignKey:'senderId'
      });
      Notification.belongsTo(models.User,{
        as : 'receiver',
        foreignKey:'receiverId'
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
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};