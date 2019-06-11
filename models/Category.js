const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CategorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String
  },
  icon: {
    type: String
  },
  tags: [
    {
      name: {
        type: Schema.Types.ObjectId,
        ref: "tags"
      },
      desc: {
        type: String
      },
      icon: {
        type: String
      }
    }
  ]
});

module.exports = Post = mongoose.model("categories", CategorySchema);
