const express = require("express");
const auth = require("../middleware/auth.mdw");
const borrowReceiptModel = require("../models/borrow_receipt.model");
const validate = require("../middleware/validate.mdw");

const router = express.Router();

router.get("/", async function (req, res) {
   const data = await borrowReceiptModel.find({});
   res.json({ data: data });
});

router.get("/:id", async function (req, res) {
   const id = req.params.id || "0";
   const data = await borrowReceiptModel.findOne({ id: id });
   res.json({ data: data });
});

router.post("/", validate(borrowReceiptModel), async function (req, res) {
   const borrow = req.body;
   const result = await new borrowReceiptModel(borrow).save();
   res.status(201).json({ borrow: result, added: true });
});

router.patch("/:id", validate(borrowReceiptModel), async function (req, res) {
   const id = req.params.id || "0";
   const newBorrow = req.body;
   const borrow = await borrowReceiptModel.findOne({ id: id });
   if (!borrow) {
      return res.status(201).json({ borrow: borrow, updated: false });
   }
   const result = await borrowReceiptModel.updateOne({ id: id }, newBorrow);
   res.status(201).json({ borrow: result, updated: true });
});

router.delete("/:id", async function (req, res) {
   const id = req.params.id || "0";
   const borrow = await borrowReceiptModel.findOne({ id: id });
   if (!borrow) {
      return res.status(201).json({ borrow: borrow, deleted: false });
   }
   const result = await borrow.remove();
   res.status(201).json({ borrow: result, deleted: true });
});

module.exports = router;
