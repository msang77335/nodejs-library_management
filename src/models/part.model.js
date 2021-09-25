const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partSchema = new Schema(
   {
      id: { type: String },
      name: { type: String, required: true },
   },
   { collection: "part" }
);

const part = mongoose.model("part", partSchema);

module.exports = part;
