const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {getInfoUser} = require('../controllers/user')
router.get("/:username", getInfoUser);

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
     cb(
        null, 
        file.fieldname + 
        '-' + Date.now() + 
        path.extname(file.originalname)
     );
  }
});

// initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000},
  fileFilter: function(req, file, cb){
     checkFileType(file, cb);
  }
}).single('Image');

// check file type
function checkFileType(file, cb){
  // Allowed ext
  const fileTypes = /jpeg|png|jpg/;
  //check ext
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  //check mime
  const mimetype = fileTypes.test(file.mimetype);

  if(mimetype && extname){
     return cb(null, true);
  }else{
     cb('Error: Images only!!')
  }
}

// Upload Single File
router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
     if(err){
        res.status(400).json({
           msg: err
        })
     }else{
        if(req.file == undefined){
           res.status(400).json({
              msg: 'Error: No file selected'
           });
        }else{
           res.status(200).json({
              msg: ':>) File  Uploaded',
              file: `uploads/${req.file.filename}`
           });
        }
     }
  });
})


module.exports = router;