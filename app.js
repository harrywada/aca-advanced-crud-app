const http       = require("http");
const path       = require("path");
const express    = require("express");
const bodyParser = require("body-parser");

const index = require("./routes/index");
const posts = require("./routes/posts");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blog");

var app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: false}));
app.use("/posts", posts);
app.use("/", index);
app.use(express.static("public"));

const port = 3000;
http.createServer(app).listen(port);
console.log(`listening on port: ${port}`);
