const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const positionSchema = new Schema(
   {
      id: { type: String },
      name: { type: String, required: true },
   },
   { collection: "position" }
);

const position = mongoose.model("position", positionSchema);

module.exports = position;
