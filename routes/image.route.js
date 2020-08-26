const router = new require("express").Router();
const upload = require("../services/image.service");

router.post("/upload", async (req, res) => {
  try {
    const { image } = req.body;
    const result = await upload(image);

    res.send(result);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
