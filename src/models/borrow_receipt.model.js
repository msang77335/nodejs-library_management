const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const borrowReceiptSchema = new Schema(
   {
      id: { type: String },
      reader: { type: String, required: true },
      borrowDate: { type: String, required: true },
      books: { type: [String], required: true },
      active: { type: Boolean },
   },
   { collection: "borrow_receipt" }
);

const borrowReceipt = mongoose.model("borrowReceipt", borrowReceiptSchema);

module.exports = borrowReceipt;
