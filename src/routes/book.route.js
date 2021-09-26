const express = require("express");
const auth = require("../middleware/auth.mdw");
const bookModel = require("../models/book.model");
const validate = require("../middleware/validate.mdw");

const router = express.Router();

router.get("/", auth, async function (req, res) {
   const data = await bookModel.find({});
   if (!data) {
      res.status(200).json({ fetch: false, data: data });
   }
   res.status(200).json({ fetch: true, data: data });
});

router.get("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const data = await bookModel.findOne({ id: id });
   if (!data) {
      res.status(200).json({
         fetch: false,
         data: data,
         message: "Book id invalid!",
      });
   }
   res.status(200).json({ fetch: true, data: data });
});

router.get("/category/:category", auth, async function (req, res) {
   const categoryId = req.params.category || "0";
   const data = await bookModel.find({ category: categoryId });
   if (!data) {
      res.status(200).json({
         fetch: false,
         data: data,
         message: "Category id invalid!",
      });
   }
   res.status(200).json({ fetch: true, data: data });
});

router.post("/", auth, validate(bookModel), async function (req, res) {
   const book = req.body;
   await new bookModel(book).save();
   res.status(201).json({ add: true, message: "Add book success!!!" });
});

router.patch("/:id", auth, validate(bookModel), async function (req, res) {
   const id = req.params.id || "0";
   const newBook = req.body;
   const book = await bookModel.findOne({ id: id });
   if (!book) {
      return res
         .status(201)
         .json({ update: false, message: "Book id invalid!" });
   }
   await bookModel.updateOne({ id: id }, newBook);
   res.status(201).json({ update: true, message: "Update book success!!!" });
});

router.delete("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const book = await bookModel.findOne({ id: id });
   if (!book) {
      return res
         .status(201)
         .json({ delete: false, message: "Book id invalid!" });
   }
   await book.remove();
   res.status(201).json({ delete: true, message: "Delete book success!!!" });
});

module.exports = router;
