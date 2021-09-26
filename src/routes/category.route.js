const express = require("express");
const auth = require("../middleware/auth.mdw");
const categoryModel = require("../models/category.model");
const validate = require("../middleware/validate.mdw");

const router = express.Router();

router.get("/", auth, async function (req, res) {
   const data = await categoryModel.find({});
   if (!data) {
      res.status(200).json({ fetch: false, data: data });
   }
   res.status(200).json({ fetch: true, data: data });
});

router.get("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const data = await categoryModel.findOne({ id: id });
   if (!data) {
      res.status(200).json({
         fetch: false,
         data: data,
         message: "Category id invalid!",
      });
   }
   res.status(200).json({ fetch: true, data: data });
});

router.post("/", auth, validate(categoryModel), async function (req, res) {
   const category = req.body;
   await new categoryModel(category).save();
   res.status(201).json({ add: true, message: "Add category success!!!" });
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
   res.status(201).json({
      updated: true,
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
   await category.remove();
   res.status(201).json({
      delete: true,
      message: "Delete category success!!!",
   });
});

module.exports = router;
