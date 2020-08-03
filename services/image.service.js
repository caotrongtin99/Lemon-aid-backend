const axios = require("axios");

const upload = async (image) => {
  const BASE_API = "https://zumi-imgur-api.herokuapp.com/upload";

  try {
    const response = await axios.post(BASE_API, { image });

    if (response.status !== 200) {
      return { error: "Error: Can not upload this image!" };
    }

    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = upload;
