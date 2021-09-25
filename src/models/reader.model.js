const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const readerSchema = new Schema(
   {
      id: { type: String, require: true },
      name: { type: String, require: true },
      email: { type: String, require: true },
      birth_day: { type: String, require: true },
      address: { type: String, require: true },
      phone: { type: String, require: true },
      category: { type: String, require: true },
      create_by: { type: String, require: true },
      password: { type: String, require: true },
   },
   { collection: "reader" }
);

const reader = mongoose.models.reader || mongoose.model("reader", readerSchema);

module.exports = reader;
