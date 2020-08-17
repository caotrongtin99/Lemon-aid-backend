const _ = require('lodash');
const {getAllPosts, createPost, updatePost, removePost, getPostById, createStep, removeStep, getPostsFromFollowings, getPostsByUserId, getFavoritePostsByUserId, searchPosts, countLikesOfPost} = require('../services/post.service');
const upload = require('../services/image.service');
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
    .then(async(posts)=>{
      let followingPosts = [];
      if (posts){
        for (let i = 0; i < posts.length ; i++){
          const numLike = await countLikesOfPost(posts[i].id);
          console.log(`${posts[i].id} =============== ${numLike}`)      
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

exports.createPost = async (req,res) => {
  const {title, description,steps, difficultLevel, hashtags, userId, categories, ingredients, ration, cookingTime} = req.body;
  let {avatar} = req.body;
  const featuredImage = await upload(avatar);
  avatar = featuredImage.data.link;
  const newSteps = await Promise.all(steps.map(async (step) => {
    if (step.image) {
      const response = await upload(step.image);
      step.image = response.data.link;
    }
    return step;
  }))
  const content = JSON.stringify(newSteps);
  const post = {title, description, avatar, content, difficultLevel, hashtags, userId, categories, ingredients, ration, cookingTime};
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

exports.updatePost = async (req, res) => {
  const {postid} = req.params;
  let postData = {
    ...req.body
  }

  if (postData.avatar){
    const response = await upload(postData.avatar);
    postData.avatar = response.data.link;
  }
  if (postData.steps){
    const newSteps = await Promise.all(postData.steps.map(async (step) => {
      if (step.image) {
        const response = await upload(step.image);
        step.image = response.data.link;
      }
      return step;
    }))
    postData.content = JSON.stringify(newSteps);
    delete postData.steps;
  }

  console.log("Post data",postData)
  
  updatePost(postData,postid)
    .then(response=>{
      res.status(200).json({
        message:"Update successfully"
      })
    })
    .catch(err=>{
      res.status(400).json({
        err : err
      })
    })
}

// exports.updatePost = (req,res) => {
//   const {id, title, description, url, avatar,content, hashtags, userId, categories, ingredients} = req.body;
//   const post = {title, description, url, avatar,content, hashtags, userId, categories, ingredients};
//   updatePost(post,id)
//     .then(post=>{
//       res.status(200).json({
//         message: "Update post successfully!!"
//       });
//     })
//     .catch(err=>{
//       res.status(400).json({
//         err : err
//       })
//     })
// }

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
      // for (let z = 0; z < post.dataValues.content.length; z++){
      //   if (post.dataValues.content[z].image){
      //   }
      // }
      for (let i = 0 ; i < post.dataValues.Comments.length ; i++){
        if (post.dataValues.Comments[i].dataValues.parentCommentId !== null){
          post.dataValues.Comments.splice(i,1);
          i--;
        }
      }
      let ingredients = post.dataValues.ingredients.split('|');
      let categories = post.dataValues.categories.split('|');
      post.dataValues.categories = categories;
      post.dataValues.ingredients = ingredients;
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

exports.searchPosts = (req,res) => {
  if (req.query.duration == null){
    req.query.duration = ''
  }
  if (req.query.level == null){
    req.query.level = ''
  }
  if (req.query.sort==null){
    req.query.sort = 'latest'
  }
  if (req.query.search == null){
    req.query.search = ''
  }
  const request = req.query;
  searchPosts(request)
    .then(data=>{
      res.status(200).json({
        posts : data
      })
    })
    .catch(err=>{
      console.log(err)
    })
}

