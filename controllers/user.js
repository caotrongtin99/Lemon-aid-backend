const {
  getUserByUsername,
  getFollowersOfUserByUserId,
  createFollow,
  removeFollow,
  likePost,
  unlikePost,
  getFavoritePosts,
  createComment,
  deleteComment,
  getActivityHistory,
  updateUserInfo,
} = require("../services/user.service");
const { getPostsByUserId } = require("../services/post.service");
const { Result } = require("express-validator");
const upload = require("../services/image.service");
const {
  getNotificationsOfUser,
  createNotification,
} = require("../services/notification.service");
//const { delete } = require('../routes/auth.route');
exports.getInfoUser = (req, res) => {
  const username = req.params.username;
  getUserByUsername(username).then((user) => {
    let userData = user.dataValues;
    userData.followings = userData.follower;
    userData.likedPosts = userData.postlike;
    delete userData.follower;
    delete userData.postlike;
    for (let j = 0; j < userData.followings.length; j++) {
      userData.followings[j].dataValues.user =
        userData.followings[j].dataValues.follower;
      delete userData.followings[j].dataValues.follower;
    }

    if (!user) {
      return res.status(400).json({
        message: "User does not exist!!!",
      });
    }
    getFollowersOfUserByUserId(userData.id).then((followers) => {
      userData.followers = followers;
      return res.status(200).json({
        userData,
      });
    });
  });
};

exports.updateUserInfo = async (req, res) => {
  const { userId } = req.params;
  const userData = {
    ...req.body,
  };
  if (userData.avatar) {
    const response = await upload(userData.avatar);
    userData.avatar = response.data.secure_url;
  }

  updateUserInfo(userData, userId)
    .then((response) => {
      console.log("response", response);
      res.status(200).json({
        message: "Update successfully!",
      });
    })
    .catch((err) => {
      console.log("err", err);
      res.status(400).json({
        err: err,
      });
    });
};

exports.follow = (req, res) => {
  const { userId, followerId } = req.body;
  createFollow(userId, followerId)
    .then((result) => {
      const notification = {
        senderId: userId,
        receiverId: followerId,
        follow: result.id,
      };
      createNotification(notification).then((success) => {
        res.status(200).json({
          message: "Follow and create notification successfully!!",
        });
      });
    })
    .catch((err) => {
      res.status(400).json({
        err: err,
      });
    });
};

exports.unfollow = (req, res) => {
  const { userId, followerId } = req.body;
  removeFollow(userId, followerId)
    .then((result) => {
      res.status(200).json({
        message: "Unfollow successfully!!",
      });
    })
    .catch((err) => {
      res.status(400).json({
        err: err,
      });
    });
};

exports.likePost = (req, res) => {
  const { userId, postId } = req.body;
  likePost(userId, postId)
    .then((result) => {
      res.status(200).json({
        message: "Liked this post!!",
      });
    })
    .catch((err) => {
      res.status(400).json({
        err: err,
      });
    });
};

exports.unlikePost = (req, res) => {
  const { userId, postId } = req.body;
  unlikePost(userId, postId)
    .then((result) => {
      res.status(200).json({
        message: "Unliked this post!!",
      });
    })
    .catch((err) => {
      res.status(400).json({
        err: err,
      });
    });
};

exports.getFavoritePosts = (req, res) => {
  const { userId } = req.params;
  getFavoritePosts(userId)
    .then((posts) => {
      res.status(200).json({
        posts,
      });
    })
    .then((err) => {
      err;
    });
};

exports.createComment = (req, res) => {
  const { message, userId, postId, parentCommentId } = req.body;
  const comment = {
    message,
    userId,
    postId,
    parentCommentId,
  };
  createComment(comment)
    .then((comment) => {
      res.status(200).json({
        message: "Comment successfully",
      });
    })
    .catch((err) => {
      res.status(400).json({
        err,
      });
    });
};

exports.deleteComment = (req, res) => {
  deleteComment(req.body.commentId)
    .then((result) => {
      res.status(200).json({
        message: "Delete successfully",
      });
    })
    .catch((err) => {
      res.status(400).json({
        err,
      });
    });
};

exports.getActivityHistory = (req, res) => {
  getActivityHistory(req.params.userId).then((activity) => {
    res.status(200).json({
      activity,
    });
  });
};

exports.getNotifications = (req, res) => {
  console.log("==============VAO DAY CHU============");
  const { userId } = req.params;
  getNotificationsOfUser(userId)
    .then((notifications) => {
      res.status(200).json({
        notifications,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
