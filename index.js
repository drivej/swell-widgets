const express = require("express");
// const https = require('https')
const path = require("path");
// const request = require('request')
const app = express();
const fs = require('fs');

app.use(express.static(path.join(__dirname, "public")));

app.all("/api/stories", (req, res) => {
  fs.readFile('./data/channel_api_response.json', 'utf8', (err, data) => {
    res.send(data);
  });
});

if (process.env.PORT && !isNaN(process.env.PORT)) {
  app.listen(process.env.PORT, function () {
    console.log("Running on env port", process.env.PORT);
  });
} else {
  const openport = require("openport");
  openport.find({ startingPort: 5000 }, function (err, port) {
    if (err) {
      console.log(err);
    } else {
      app.listen(port, function () {
        console.log("Running on port", port);
      });
    }
  });
}
