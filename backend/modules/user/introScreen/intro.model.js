const mongoose = require("mongoose");

const introSchema = new mongoose.Schema(
  {
    content: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);
const Intro = mongoose.model("Intro", introSchema);
module.exports = Intro;