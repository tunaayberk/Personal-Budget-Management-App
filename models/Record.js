const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const RecordSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: [
    {
      category: {
        type: Schema.Types.ObjectId,
        ref: "categories"
      }
    }
  ],
  tags: [
    {
      tag: {
        type: Schema.Types.ObjectId,
        ref: "tags"
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model("records", RecordSchema);
