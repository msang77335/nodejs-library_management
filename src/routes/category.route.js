const express = require("express");
const auth = require("../middleware/auth.mdw");
const categoryModel = require("../models/category.model");
const validate = require("../middleware/validate.mdw");

const router = express.Router();

router.get("/", auth, async function (req, res) {
   const data = await categoryModel.find({});
   res.json({ data: data });
});

router.get("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const data = await categoryModel.findOne({ id: id });
   res.json({ data: data });
});

router.post("/", validate(categoryModel), async function (req, res) {
   const category = req.body;
   const result = await new categoryModel(category).save();
   res.status(201).json({ category: result, added: true });
});

router.patch("/:id", validate(categoryModel), async function (req, res) {
   const id = req.params.id || "0";
   const newCategory = req.body;
   const category = await categoryModel.findOne({ id: id });
   if (!category) {
      return res.status(201).json({ category: category, updated: false });
   }
   const result = await categoryModel.updateOne({ id: id }, newCategory);
   res.status(201).json({ category: result, updated: true });
});

router.delete("/:id", async function (req, res) {
   const id = req.params.id || "0";
   const category = await categoryModel.findOne({ id: id });
   if (!category) {
      return res.status(201).json({ category: category, deleted: false });
   }
   const result = await category.remove();
   res.status(201).json({ category: result, deleted: true });
});

module.exports = router;
