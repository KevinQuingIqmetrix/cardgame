import express = require("express");

const app = express();

app.get("/api/test", (req, res) => {
  res.send("Hello world!");
});
app.listen(905);
