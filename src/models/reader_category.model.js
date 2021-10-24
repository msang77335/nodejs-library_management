const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const readerCategorySchema = new Schema(
   {
      id: { type: String },
      name: { type: String, required: true },
      active: { type: Boolean },
   },
   { collection: "reader_category" }
);

const readerCategory = mongoose.model("readerCategory", readerCategorySchema);

module.exports = readerCategory;
