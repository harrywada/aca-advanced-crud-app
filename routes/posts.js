const express = require("express");
var router = express.Router();
var PostController = require("../controllers/PostController.js");

router.get("/", function(req, res){
  PostController.list(req, res);
});

router.get("/:id", function(req, res){
  PostController.show(req, res);
});

router.post("/", function(req, res){
  PostController.create(req, res);
});

router.put("/:id", function(req, res){
  PostController.update(req, res);
});

router.delete("/:id", function(req, res){
  PostController.delete(req, res);
});

module.exports = router;
