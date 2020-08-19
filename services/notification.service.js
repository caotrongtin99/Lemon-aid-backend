var models = require('../models');
let Notification = models.Notification;
const Sequelize = require('sequelize')

exports.getNotificationsOfUser = (userId) => {
  return Notification.findAll({
    attributes:['id','like','follow','comment','senderId','receiverId'],
    where: {
      receiverId : userId
    },
    include: [
      {
        attributes: ['id','userId','postId'],
        model : models.PostLike,
        as : 'likeAction',
        include : [
          {
            attributes: ['id','title','avatar','updatedAt'],
            model: models.Post,
            as : 'post'
          }
        ]
      },
      {
        attributes: ['id','username','avatar'],
        model: models.User,
        as: 'notificationReceiver'
      },
      {
        attributes: ['id','username','avatar'],
        model: models.User,
        as: 'notificationSender'
      },
      {
        model: models.Comment,
        as: 'commentAction'
      }
    ]
  })
}

exports.createNotification = (notification) => {
  return Notification.create(notification);
}

exports.seenNotification = (notificationId) => {
  return Notification.update({isSeen: true},{where: {
    id : notificationId
  }})
}