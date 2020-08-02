const {getAllPosts, createPost, updatePost, removePost, getPostById, createStep, removeStep, getPostsFromFollowings, getPostsByUserId, getFavoritePostsByUserId} = require('../services/post.service')
exports.getAllPosts = (req,res) =>{
  getAllPosts()
    .then(posts=>{
      if (posts){
        for (var i = 0 ; i< posts.length; i++){
          for (let j = 0 ; j < posts[i].dataValues.Comments.length ; j++){
            if (posts[i].dataValues.Comments[j].dataValues.parentCommentId !== null){
              posts[i].dataValues.Comments.splice(j,1);
              j--;
            }
          }
          posts[i].dataValues.author = posts[i].dataValues.User;
          posts[i].dataValues.likes = posts[i].dataValues.postlike;
          const user = posts[i].dataValues.postlike.postlike;
          posts[i].dataValues.likes.user = user;
          posts[i].dataValues.content = JSON.parse(posts[i].dataValues.content)
          delete posts[i].dataValues.User;
          delete posts[i].dataValues.likes.postlike;
          delete posts[i].dataValues.postlike;
        }
        res.status(200).json({
          posts
        })
      }
    })
    .catch(err=>{
      res.status(400).json({
        err
      })
    })
}

exports.getPostsByTabs = (req,res) =>{
  const {userId} = req.query;
  console.log(req.query)
  getPostsFromFollowings(userId)
    .then(posts=>{
      let followingPosts = [];
      if (posts){
        for (let i = 0; i < posts.length ; i++){
          console.log(posts[i].dataValues.follower.dataValues.Posts)
          for (let j = 0; j < posts[i].dataValues.follower.dataValues.Posts.length ; j++){
            followingPosts.push(posts[i].dataValues.follower.dataValues.Posts[i])
          }
        }
      }
      getPostsByUserId(userId)
        .then(myPosts=>{
          getFavoritePostsByUserId(userId)
            .then(favoritePosts=>{
              res.status(200).json({
                favoritePosts,
                myPosts,
                followingPosts
              })
            })
        })
    })
    .catch(err=>{
      console.log(err);
      
      res.status(400).json({
        err
      })
    })
}

exports.createPost = (req,res) => {
  const {id,title, description, url, avatar,steps, difficultLevel, hashtags, userId, categories, ingredients, ration, cookingTime} = req.body;
  const content = JSON.stringify(steps);
  const post = {id,title, description, url, avatar, content, difficultLevel, hashtags, userId, categories, ingredients, ration, cookingTime};
  createPost(post)
    .then(post=>{
      res.status(200).json({
        message: "Post successfully!!"
      });
    })
    .catch(err=>{
      res.status(400).json({
        err : err
      })
    })
}

exports.updatePost = (req,res) => {
  const {id, title, description, url, avatar,content, hashtags, userId, categories, ingredients} = req.body;
  const post = {title, description, url, avatar,content, hashtags, userId, categories, ingredients};
  updatePost(post,id)
    .then(post=>{
      res.status(200).json({
        message: "Update post successfully!!"
      });
    })
    .catch(err=>{
      res.status(400).json({
        err : err
      })
    })
}

exports.removePost = (req,res) => {
  const {id} = req.body;
  removePost(id)
    .then(result=>{
      res.status(200).json({
        message: "remove post successfully!!"
      });
    })
    .catch(err=>{
      res.status(400).json({
        err : err
      })
    })
}

exports.getPostById = (req,res)=>{
  const {postid}  = req.params;
  getPostById(postid)
    .then(post=>{
      post.dataValues.author = post.dataValues.User;
      post.dataValues.likes = post.dataValues.postlike;
      const user = post.dataValues.postlike.postlike;
      post.dataValues.likes.user = user;
      post.dataValues.content = JSON.parse(post.dataValues.content)
      
      for (let i = 0 ; i < post.dataValues.Comments.length ; i++){
        if (post.dataValues.Comments[i].dataValues.parentCommentId !== null){
          post.dataValues.Comments.splice(i,1);
          i--;
        }
      }
      let ingredients = post.dataValues.ingredients.split('|');
      post.dataValues.ingredients = ingredients;
      console.log("=================Ingredients=============",ingredients)
      delete post.dataValues.User;
      delete post.dataValues.likes.postlike;
      delete post.dataValues.postlike;
      res.status(200).json({
        post
      })
    })
}

//exports.getPostsFromFollowings

exports.createStep = (req,res) => {
  const {stt, content, image, postId} = req.body;
  const step = {stt, content, image, postId};
  createStep(step)
    .then(step=>{
      res.status(200).json({
        message: "Create Step successfully!!"
      });
    })
    .catch(err=>{
      res.status(400).json({
        err : err
      })
    })
}

exports.removeStep = (req,res) => {
  const {id} = req.body;
  removeStep(id)
    .then(result=>{
      res.status(200).json({
        message: "remove step successfully!!"
      });
    })
    .catch(err=>{
      res.status(400).json({
        err : err
      })
    })
}

