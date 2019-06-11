const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TagSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
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
  image: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("tags", TagSchema);
