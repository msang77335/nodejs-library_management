const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const readerSchema = new Schema(
   {
      id: { type: String },
      name: { type: String, require: true },
      email: { type: String, require: true },
      birthDay: { type: String, require: true },
      address: { type: String, require: true },
      phone: { type: String, require: true },
      category: { type: String, require: true },
      createBy: { type: String, require: true },
      createDate: { type: String },
      active: { type: Boolean },
   },
   { collection: "reader" }
);

const reader = mongoose.models.reader || mongoose.model("reader", readerSchema);

module.exports = reader;
