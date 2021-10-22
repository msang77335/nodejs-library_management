const express = require("express");
const auth = require("../middleware/auth.mdw");
const categoryModel = require("../models/category.model");
const bookModel = require("../models/book.model");
const validate = require("../middleware/validate.mdw");

const router = express.Router();

router.get("/", auth, async function (req, res) {
   const data = await categoryModel.find({ active: true });
   if (!data) {
      return res.status(200).json({ fetch: false, data: data });
   }
   return res.status(200).json({ fetch: true, data: data });
});

router.get("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const data = await categoryModel.findOne({ id: id, active: true });
   if (!data) {
      return res.status(200).json({
         fetch: false,
         data: data,
         message: "Category id invalid!",
      });
   }
   return res.status(200).json({ fetch: true, data: data });
});

router.post("/", auth, validate(categoryModel), async function (req, res) {
   const category = req.body;
   const lastCategory = await categoryModel.find().sort({ id: -1 }).limit(1);
   const lastId = lastCategory[0].id.split(".")[1];
   const id = "C.".concat((parseInt(lastId) + 1).toString().padStart(6, "0"));
   await new categoryModel({ id: id, active: true, ...category }).save();
   return res
      .status(201)
      .json({ add: true, message: "Add category success!!!" });
});

router.patch("/:id", auth, validate(categoryModel), async function (req, res) {
   const id = req.params.id || "0";
   const newCategory = req.body;
   const category = await categoryModel.findOne({ id: id });
   if (!category) {
      return res
         .status(201)
         .json({ update: false, message: "Category id invalid!" });
   }
   await categoryModel.updateOne({ id: id }, newCategory);
   return res.status(201).json({
      update: true,
      message: "Update category success!!!",
   });
});

router.delete("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const category = await categoryModel.findOne({ id: id });
   if (!category) {
      return res
         .status(201)
         .json({ delete: false, message: "Category id invalid!" });
   }
   const bookList = await bookModel.find({ category: id });
   if (bookList.length > 0) {
      return res
         .status(201)
         .json({ delete: false, message: "Category id valid in a book!" });
   }
   // await category.remove();
   await categoryModel.updateOne({ id: id }, { $set: { active: false } });
   return res.status(201).json({
      delete: true,
      message: "Delete category success!!!",
   });
});

module.exports = router;
