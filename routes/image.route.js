const router = new require("express").Router();
const axios = require("axios");

router.post("/upload", async (req, res) => {
  const BASE_API = "https://zumi-imgur-api.herokuapp.com/upload";
  const { image } = req.body;

  try {
    const response = await axios.post(BASE_API, { image });

    if (response.status !== 200) {
      return res
        .status(400)
        .send({ error: "Error: Can not upload this image!" });
    }

    res.send(response.data);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
