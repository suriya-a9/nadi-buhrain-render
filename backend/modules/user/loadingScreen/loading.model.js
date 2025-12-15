const mongoose = require("mongoose");

const loadingSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Loading = mongoose.model("Loading", loadingSchema);
module.exports = Loading;
