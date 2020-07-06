const express = require('express');
const router = express.Router();
const {getAllPosts} = require('../controllers/post')
router.get("/post", getAllPosts);


module.exports = router;