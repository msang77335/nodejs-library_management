const express = require("express");
const auth = require("../middleware/auth.mdw");
const bookModel = require("../models/book.model");
const categoryModel = require("../models/category.model");
const validate = require("../middleware/validate.mdw");
const moment = require("moment");

const router = express.Router();

router.get("/", auth, async function (req, res) {
   const data = await bookModel.find({ active: true });
   if (!data) {
      return res.status(200).json({ fetch: false, data: null });
   }
   const categoryList = await categoryModel.find({});
   const bookList = data.map((value) => {
      const category = categoryList.find(
         (category) => category.id == value.category
      );
      return {
         id: value.id,
         name: value.name,
         category: { key: category.id, value: category.name },
         author: value.author,
         publisYear: { type: String, required: true },
         publisher: value.publisher,
         addDate: value.addDate,
         reciever: value.reciever,
         price: value.price,
         active: value.active,
      };
   });
   return res.status(200).json({ fetch: true, data: bookList });
});

router.get("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const data = await bookModel.findOne({ id: id, active: true });
   if (!data) {
      return res.status(200).json({
         fetch: false,
         data: data,
         message: "Book id invalid!",
      });
   }
   const category = await categoryModel.findOne({ id: data.category });
   const book = {
      id: data.id,
      name: data.name,
      category: { key: category.id, value: category.name },
      author: data.author,
      publisYear: { key: data.publisYear, value: data.publisYear },
      publisher: data.publisher,
      addDate: data.addDate,
      reciever: data.reciever,
      price: data.price,
      active: data.active,
   };
   return res.status(200).json({ fetch: true, data: book });
});

router.get("/category/:category", auth, async function (req, res) {
   const categoryId = req.params.category || "0";
   const category = await categoryModel.findOne({
      id: categoryId,
      active: true,
   });
   if (!category) {
      return res.status(200).json({
         fetch: false,
         data: data,
         message: "Category id invalid!",
      });
   }
   const data = await bookModel.find({ category: categoryId });
   if (!data) {
      return res.status(200).json({
         fetch: false,
         data: data,
         message: "Category id invalid!",
      });
   }
   return res.status(200).json({ fetch: true, data: data });
});

router.post("/", auth, validate(bookModel), async function (req, res) {
   const book = req.body;
   const lastBook = await bookModel.find().sort({ id: -1 }).limit(1);
   const lastId = lastBook[0].id.split(".")[1];
   const newId = "B.".concat(
      (parseInt(lastId) + 1).toString().padStart(6, "0")
   );
   book.active = true;
   book.id = newId;
   book.addDate = moment().format("MM-DD-YYYY");
   await new bookModel(book).save();
   return res.status(201).json({ add: true, message: "Add book success!!!" });
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
   return res
      .status(201)
      .json({ update: true, message: "Update book success!!!" });
});

router.delete("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const book = await bookModel.findOne({ id: id });
   if (!book) {
      return res
         .status(201)
         .json({ delete: false, message: "Book id invalid!" });
   }
   // await book.remove();
   await bookModel.updateOne({ id: id }, { $set: { active: false } });
   return res
      .status(201)
      .json({ delete: true, message: "Delete book success!!!" });
});

module.exports = router;
