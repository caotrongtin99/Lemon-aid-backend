const router = new require("express").Router();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "lemonaid",
  api_key: "152116876754551",
  api_secret: "reS9iHJ_B5CgwUias0fFrCo_Wyc",
});

router.post("/upload", async (req, res) => {
  try {
    const { image } = req.body;
    const result = await cloudinary.uploader.upload(image);

    res.send(result);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
