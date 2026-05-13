const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["video", "article"],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    caption: {
      type: String,
    },
    creator: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    format: {
      type: String,
    },
    category: {
      type: String,
    },
    source: {
      type: String,
      enum: ["extension", "manual"],
    },
  },
  { timestamps: true },
);

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
