var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var postSchema = new Schema({
  title:   {type: String, required: true},
  date:    {type: Date, required: true},
  content: String
});

module.exports = mongoose.model("Post", postSchema);
