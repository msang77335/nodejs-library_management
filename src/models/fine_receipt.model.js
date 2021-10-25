const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fineReceiptSchema = new Schema(
   {
      id: { type: String },
      reader: { type: String, required: true },
      debt: { type: Number, required: true },
      payment: { type: Number, required: true },
      remaining: { type: Number },
      createBy: { type: String, require: true },
      createDate: { type: String },
      active: { type: Boolean },
   },
   { collection: "fine_receipt" }
);

const fineReceipt = mongoose.model("fineReceipt", fineReceiptSchema);

module.exports = fineReceipt;
