const express = require('express');
const router = express.Router();
const {signin,signup,signout} = require('../controllers/auth')
const { runValidation } = require("../validators");
const {
  userSignupValidator,
  userSigninValidator
} = require("../validators/auth.validator");

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/signin", userSigninValidator, runValidation, signin);
router.get("/signout",signout);

module.exports = router;