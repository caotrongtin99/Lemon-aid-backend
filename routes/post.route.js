const express = require('express');
const router = express.Router();
const {getAllPosts,createPost,updatePost,removePost, getPostById, createStep, removeStep, getPostsByTabs} = require('../controllers/post');
const requireLogin = require('../middlewares/requireLogin');
router.get("/post", getAllPosts);
// router.get("/post/following", getAllPostsFromFollowings);
router.get("/post/getPostsByTabs",requireLogin,getPostsByTabs)
router.get("/post/getpost/:postid",getPostById);
router.post("/post/create",requireLogin,createPost);
router.post("/post/update",requireLogin,updatePost);
router.post("/post/remove",requireLogin,removePost);
router.post("/step/create",requireLogin,createStep);
router.post("/step/remove",requireLogin,removeStep);
module.exports = router;