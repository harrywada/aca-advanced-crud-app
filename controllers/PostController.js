var PostModel = require("../models/PostModel.js");

module.exports = {
  list: function(req, res){
    PostModel.find(function(err, posts){
      if(!err){
        res.json(posts);
        return res.end();
      }
      console.log("error: " + err);
      res.json({error: true});
      return res.end();
    });
  },
  show: function(req, res){
    var id = req.params.id;

    PostModel.findOne({_id: id}, function(err, post){
      if(!err){
        res.json(post);
        return res.end();
      }
      console.log("error: " + err);
      res.json({error: true});
      return res.end();
    });
  },
  create: function(req, res){
    var post = new PostModel({
      title:   req.body.title,
      date:    req.body.date,
      content: req.body.content
    });

    post.save(function(err, post){
      if(!err){
        res.json(post);
        return res.end();
      }
      console.log("error: " + err);
      res.json({error: true});
      return res.end();
    });
  },
  update: function(req, res){
    var id = req.params.id;

    PostModel.findOne({_id: id}, function(err, post){
      if(!err){
        post.title   = req.body.title ? req.body.title : post.title;
        post.date    = req.body.date ? req.body.date : post.date;
        post.content = req.body.content ? req.body.content : post.content;

        post.save(function(err, post){
          if(!err){
            res.json(post);
            return res.end();
          }
          console.log("error: " + err);
          res.json({error: true});
          return res.end();
        });
      }
      else{
        console.log("error: " + err);
        res.json({error: true});
        return res.end();
      }
    });
  },
  delete: function(req, res){
    var id = req.params.id;

    PostModel.findByIdAndRemove(id, function(err, post){
      if(!err){
        res.json(post);
        return res.end();
      }
      console.log("error: " + err);
      res.json({error: true});
      return res.end();
    });
  }
}
