const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
   {
      id: { type: String },
      srcUser: { type: String, required: true },
      dstUser: { type: String, required: true },
      content: { type: String, required: true },
      timeSend: { type: String, required: true },
   },
   { collection: "message" }
);

const message =
   mongoose.models.Message || mongoose.model("message", messageSchema);

module.exports = message;
