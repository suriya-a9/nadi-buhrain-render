const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema(
  {
    roadId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Road"
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Block = mongoose.model("Block", blockSchema);
module.exports = Block;
