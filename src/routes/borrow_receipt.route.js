const express = require("express");
const auth = require("../middleware/auth.mdw");
const borrowReceiptModel = require("../models/borrow_receipt.model");
const validate = require("../middleware/validate.mdw");

const router = express.Router();

router.get("/", auth, async function (req, res) {
   const data = await borrowReceiptModel.find({});
   if (!data) {
      res.status(200).json({ fetch: false, data: data });
   }
   res.status(200).json({ fetch: true, data: data });
});

router.get("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const data = await borrowReceiptModel.findOne({ id: id });
   if (!data) {
      res.status(200).json({
         fetch: false,
         data: dataj,
         message: "Borrow receipt id invalid!",
      });
   }
   res.status(200).json({ fetch: true, data: data });
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
      return res.status(200).json({
         borrow: borrow,
         deleted: false,
         message: "Borrow receipt invalid!",
      });
   }
   await borrow.remove();
   res.status(200).json({
      delete: true,
      message: "Delete borrow receipt success!!!",
   });
});

module.exports = router;
