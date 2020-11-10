var express = require("express");
var http = require("http");
var app = express();
const path = require("path");
const configRoutes = require("./routes");

app.use(express.static(__dirname + "/public"));
configRoutes(app);
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
