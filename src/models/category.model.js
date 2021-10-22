const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
   {
      id: { type: String },
      name: { type: String, required: true },
      active: { type: Boolean },
   },
   { collection: "category" }
);

const category = mongoose.model("category", categorySchema);

module.exports = category;
