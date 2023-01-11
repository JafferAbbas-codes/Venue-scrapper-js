// const obj = require("./scraped_data.json");
const obj = require("./data.json");
const axios = require("axios");

obj.venues.map(async (venue, i) => {
  venue.ownerId = 1;
  axios
    .post("http://localhost:4000/api/venue", venue)
    .then((response) => {
      console.log("response", i, response.status);
    })
    .catch((err) => {
      console.log("err", err);
    });
});
