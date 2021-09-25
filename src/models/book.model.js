const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema(
   {
      id: { type: String },
      name: { type: String, required: true },
      category: { type: String, required: true },
      author: { type: String, required: true },
      publis_year: { type: String, required: true },
      publisher: { type: String, required: true },
      added: { type: String, required: true },
      reciever: { type: String, required: true },
      price: { type: String, required: true },
   },
   { collection: "book" }
);

const book = mongoose.models.Book || mongoose.model("book", bookSchema);

module.exports = book;
