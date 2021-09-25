const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fineSchema = new Schema(
   {
      id: { type: String },
      reader: { type: String, required: true },
      debt: { type: Number, required: true },
   },
   { collection: "fine" }
);

const fine = mongoose.model("fine", fineSchema);

module.exports = fine;
