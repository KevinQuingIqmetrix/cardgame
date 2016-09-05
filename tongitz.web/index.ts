import express = require("express");
import services = require("./services");

const app = express();

app.get("/api/test", (req, res) => {
  res.send("Hello world!");
});

services(app);

app.listen(905, () => {
  console.log("api listening at port 905");
});
