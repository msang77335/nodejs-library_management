const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const degreeSchema = new Schema(
   {
      id: { type: String },
      name: { type: String, required: true },
   },
   { collection: "degree" }
);

const degree = mongoose.model("degree", degreeSchema);

module.exports = degree;
