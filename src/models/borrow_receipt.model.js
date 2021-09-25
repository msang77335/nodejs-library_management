const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const borrowReceiptSchema = new Schema(
   {
      id: { type: String },
      reader: { type: String, required: true },
      borrow_date: { type: String, required: true },
      books: { type: [String], required: true },
   },
   { collection: "borrow_receipt" }
);

const borrowReceipt = mongoose.model("borrowReceipt", borrowReceiptSchema);

module.exports = borrowReceipt;
