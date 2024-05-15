const { ReturnDocument, Decimal128 } = require("mongodb");
const mongoose = require("mongoose");

const TokenSchema = mongoose.Schema({
  token: { type: String, required: true },
});

module.exports = mongoose.model("Token", TokenSchema);
