const { ReturnDocument, Decimal128 } = require("mongodb");
const mongoose = require("mongoose");

const GraffitiSchema = mongoose.Schema({
  graffitiSurveyNumber: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  postcode: { type: String, required: true },
  location: [
    { longitude: { type: Decimal128 }, latitude: { type: Decimal128 } },
  ],
  imgLocation: { type: String },
});

module.exports = mongoose.model("Graffiti", GraffitiSchema);
