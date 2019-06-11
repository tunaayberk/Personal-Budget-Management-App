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
      name: {
        type: Schema.Types.ObjectId,
        ref: "categories"
      },
      icon: {
        type: String
      }
    }
  ],
  tags: [
    {
      name: {
        type: Schema.Types.ObjectId,
        ref: "tags"
      },
      icon: {
        type: String
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model("records", RecordSchema);
