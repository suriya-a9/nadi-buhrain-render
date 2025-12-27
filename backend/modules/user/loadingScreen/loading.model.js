const mongoose = require("mongoose");

const loadingSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
const Loading = mongoose.model("Loading", loadingSchema);
module.exports = Loading;
