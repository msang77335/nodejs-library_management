const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema(
   {
      id: { type: String },
      name: { type: String, required: true },
      category: { type: String, required: true },
      author: { type: String, required: true },
      publisYear: { type: String, required: true },
      publisher: { type: String, required: true },
      //addDate: { type: String, required: true },
      reciever: { type: String },
      price: { type: String, required: true },
      active: { type: Boolean },
   },
   { collection: "book" }
);

const book = mongoose.models.Book || mongoose.model("book", bookSchema);

module.exports = book;
