const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "lemonaid",
  api_key: "152116876754551",
  api_secret: "reS9iHJ_B5CgwUias0fFrCo_Wyc",
});

const upload = async (image) => {
  try {
    return await cloudinary.uploader.upload(image);
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = upload;
