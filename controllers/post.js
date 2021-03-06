const _ = require('lodash');
const {getAllPosts, createPost, updatePost, removePost, getPostById, createStep, removeStep, getPostsFromFollowings,getPostsFromFollowingsWithoutPagination, getPostsByUserId, getPostsByUserIdWithoutPagination, getFavoritePostsByUserId, getFavoritePostsByUserIdWithoutPagination, searchPosts, countLikesOfPost, searchPostsWithoutPagination} = require('../services/post.service');
const upload = require('../services/image.service');
const querystring = require('querystring');

exports.getAllPosts = (req,res) =>{
  let {limit,page}= req.query;
  if (!limit){
    limit = 20
  }
  if (!page){
    page = 1
  }
  getAllPosts(limit, page)
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
          for (let z = 0; z < posts[i].dataValues.likes.length; z ++){
            console.log("=====user")
            posts[i].dataValues.likes[z].dataValues.user = posts[i].dataValues.likes[z].dataValues.postlike;
            delete posts[i].dataValues.likes[z].dataValues.postlike;
          }
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
      console.log(err)
      res.status(400).json({
        err: err
      })
    })
}

exports.getPostsByTabs = (req,res) =>{
  let {userId,type,limit,page} = req.query;
  if (!limit){
    limit = 4
  }
  if (!page){
    page = 1;
  }
  if (type === "favorite"){
    getFavoritePostsByUserId(userId,limit,page)
      .then(favoritePosts=>{
        const formatFavoritePosts = favoritePosts.map((post)=>{
          console.log("=========post==========",post)
          post.dataValues.post.dataValues.numberOfLikes = post.dataValues.post.dataValues.postlike.length;
          delete post.dataValues.post.dataValues.postlike;
          return post.dataValues.post.dataValues;
        })
        getFavoritePostsByUserIdWithoutPagination(userId)
          .then(allFavoritePosts=>{
            res.status(200).json({
              posts: formatFavoritePosts,
              totalItems: allFavoritePosts.length
            })
          })
      })
  }else if (type === "following"){
    getPostsFromFollowings(userId,limit,page)
      .then((posts)=>{
        let followingPosts = [];
        if (posts){
          for (let i = 0; i < posts.length ; i++){
            console.log("===========post=========",posts[i].dataValues.follower.dataValues.Posts);
            for (let j = 0; j < posts[i].dataValues.follower.dataValues.Posts.length ; j++){
              console.log("push pos==============",)
              followingPosts.push(posts[i].dataValues.follower.dataValues.Posts[j])
            }
          }
        }
        console.log("==============foloowing posts==========",followingPosts)
        followingPosts = followingPosts.map((post)=>{
          if (post.dataValues.postlike){
          post.dataValues.numberOfLikes = post.dataValues.postlike.length;
          delete post.dataValues.postlike;
          }
          return post;
        })
        getPostsFromFollowingsWithoutPagination(userId)
        .then(allFollowingPosts=>{
          let allPosts = [];
          if (allFollowingPosts){
            for (let i = 0; i < allFollowingPosts.length ; i++){  
              for (let j = 0; j < allFollowingPosts[i].dataValues.follower.dataValues.Posts.length ; j++){
                allPosts.push(allFollowingPosts[i].dataValues.follower.dataValues.Posts[i])
              }
            }
          }
          res.status(200).json({
            posts: followingPosts,
            totalItems: allPosts.length
          })    
        })
      })  
  } else {
    getPostsByUserId(userId,limit,page)
      .then(myPosts=>{
        myPosts = myPosts.map(post=>{
          post.dataValues.numberOfLikes = post.dataValues.postlike.length;
          delete post.dataValues.postlike;
          return post;
        })
        getPostsByUserIdWithoutPagination(userId)
          .then(allMyPosts=>{
            res.status(200).json({
              posts: myPosts,
              totalItems: allMyPosts.length
            }) 
          })
      })
  }
  // getPostsFromFollowings(userId,limit,page)
  //   .then(async(posts)=>{
  //     let followingPosts = [];
  //     if (posts){
  //       for (let i = 0; i < posts.length ; i++){  
  //         for (let j = 0; j < posts[i].dataValues.follower.dataValues.Posts.length ; j++){
  //           followingPosts.push(posts[i].dataValues.follower.dataValues.Posts[i])
  //         }
  //       }
  //     }
  //     getPostsByUserId(userId,limit,page)
  //       .then(myPosts=>{
  //         getFavoritePostsByUserId(userId,limit,page)
  //           .then(favoritePosts=>{
  //             const formatFavoritePosts = favoritePosts.map((post)=>{
  //               console.log( post.dataValues.post.dataValues)
  //               return post.dataValues.post.dataValues;
  //             })
  //             if (type === "favorite"){
  //               getFavoritePostsByUserIdWithoutPagination(userId)
  //                 .then(allFavoritePosts=>{
  //                   res.status(200).json({
  //                     posts: formatFavoritePosts,
  //                     totalItems: allFavoritePosts.length
  //                   })
  //                 })
  //             } else if (type === "following"){
  //               getPostsFromFollowingsWithoutPagination(userId)
  //                 .then(allFollowingPosts=>{
  //                   res.status(200).json({
  //                     posts: followingPosts,
  //                     totalItems: allFollowingPosts.length
  //                   })    
  //                 })
  //             } else {
  //               res.status(200).json({
  //                 myPosts,
  //                 numberMyPosts: myPosts.length,
  //                 numberOfFollowingPosts: followingPosts.length,
  //                 numberFavoritePosts: favoritePosts.length
  //               })
  //             }

  //           })
  //       })
  //   })
  //   .catch(err=>{
  //     console.log(err);
      
  //     res.status(400).json({
  //       err
  //     })
  //   })
}

exports.createPost = async (req,res) => {
  const {title, description,steps, difficultLevel, hashtags, userId, categories, ingredients, ration, cookingTime} = req.body;
  let {avatar} = req.body;
  const featuredImage = await upload(avatar);
  avatar = _.get(featuredImage,'secure_url');
  const newSteps = await Promise.all(steps.map(async (step) => {
    if (step.image) {
      const response = await upload(step.image);
      console.log(response)
      step.image = response.secure_url;
    }
    return step;
  }))
  const content = JSON.stringify(newSteps);
  const post = {title, description, avatar, content, difficultLevel, hashtags, userId, categories, ingredients, ration, cookingTime};
  createPost(post)
    .then(post=>{
      res.status(200).json({
        message: "Post successfully!!",
        post
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
    postData.avatar = response.secure_url;
  }
  if (postData.steps){
    const newSteps = await Promise.all(postData.steps.map(async (step) => {
      if (step.image) {
        const response = await upload(step.image);
        step.image = response.secure_url;
      }
      return step;
    }))
    postData.content = JSON.stringify(newSteps);
    delete postData.steps;
  }
  
  updatePost(postData,postid)
    .then(response=>{
      console.log("===========result============",response)
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
      if (!post){
        return res.status(200).json({
          message: "Post is not exist!!!"
        })
      }
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
      for (let j = 0; j < post.dataValues.likes.length;j++){
        console.log("=========posstlike",post.dataValues.likes[j])
        post.dataValues.likes[j].dataValues.user = post.dataValues.likes[j].dataValues.postlike;
      }
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
  console.log("==============req.query",req.query)
  if (req.query.mintime == null){
    req.query.mintime = 0
  }
  if (req.query.maxtime == null){
    req.query.maxtime = 1000;
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

  if (req.query.category == null){
    req.query.category = ''
  }
  if (!req.query.limit){
    req.query.limit = 20
  }
  if (!req.query.page){
    req.query.page = 1
  }
  const request = req.query;
  const requestWithoutPaging = {
    mintime : req.query.mintime,
    maxtime : req.query.maxtime,
    level : req.query.level,
    search : req.query.search,
    category : req.query.category,
    sort: req.query.sort
  }
  console.log("================request============",request)
  searchPosts(request)
    .then(data=>{
      console.log("===========data  paging========",data);
      searchPostsWithoutPagination(requestWithoutPaging)
        .then(allPosts=>{
          res.status(200).json({
            posts : data,
            numberOfPosts: allPosts.length
          })
        })
    })
    .catch(err=>{
      console.log(err)
    })
}

