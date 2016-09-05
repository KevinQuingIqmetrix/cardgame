import express = require("express");
import services = require("./services");
import {TongitzApi} from "../tongitz.api/TongitzApi";

const tongitzApi = new TongitzApi();
const app = express();

app.get("/api/test", (req, res) => {
  res.send("Hello world!");
});

services(app, tongitzApi);

app.listen(905, () => {
  console.log("api listening at port 905");
});
