const express = require("express");
const auth = require("../middleware/auth.mdw");
const bookModel = require("../models/book.model");
const validate = require("../middleware/validate.mdw");

const router = express.Router();

router.get("/", auth, async function (req, res) {
   const data = await bookModel.find({});
   res.json({ data: data });
});

router.get("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const data = await bookModel.findOne({ id: id });
   res.json({ data: data });
});

router.get("/category/:category", auth, async function (req, res) {
   const categoryId = req.params.category || "0";
   const data = await bookModel.find({ category: categoryId });
   res.json({ data: data });
});

router.post("/", validate(bookModel), async function (req, res) {
   const book = req.body;
   const result = await new bookModel(book).save();
   res.status(201).json({ book: result, added: true });
});

router.patch("/:id", validate(bookModel), async function (req, res) {
   const id = req.params.id || "0";
   const newBook = req.body;
   const book = await bookModel.findOne({ id: id });
   if (!book) {
      return res.status(201).json({ book: book, updated: false });
   }
   const result = await bookModel.updateOne({ id: id }, newBook);
   res.status(201).json({ book: result, updated: true });
});

router.delete("/:id", async function (req, res) {
   const id = req.params.id || "0";
   const book = await bookModel.findOne({ id: id });
   if (!book) {
      return res.status(201).json({ book: book, deleted: false });
   }
   const result = await book.remove();
   res.status(201).json({ book: result, deleted: true });
});

module.exports = router;
