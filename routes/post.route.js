const express = require('express');
const router = express.Router();
const {getAllPosts,createPost,updatePost,removePost, getPostById, createStep, removeStep, getPostsByTabs, searchPosts} = require('../controllers/post');
const requireLogin = require('../middlewares/requireLogin');
router.get("/post", getAllPosts);
// router.get("/post/following", getAllPostsFromFollowings);
router.get("/post/getPostsByTabs",getPostsByTabs)
router.get("/post/getpost/:postid",requireLogin,getPostById);
router.post("/post/create",createPost);
router.post("/post/remove",requireLogin,removePost);
router.put("/post/update/:postid",requireLogin,updatePost);
router.post("/step/create",createStep);
router.post("/step/remove",removeStep);
router.get("/post/search",searchPosts);
module.exports = router;