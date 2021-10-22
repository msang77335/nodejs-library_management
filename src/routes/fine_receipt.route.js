const express = require("express");
const auth = require("../middleware/auth.mdw");
const fineReceiptModel = require("../models/fine_receipt.model");
const fineModel = require("../models/fine.model");
const validate = require("../middleware/validate.mdw");

const router = express.Router();

router.get("/", auth, async function (req, res) {
   const data = await fineReceiptModel.find({ active: true });
   if (!data) {
      return res.status(200).json({ fetch: false, data: data });
   }
   return res.status(200).json({ fetch: true, data: data });
});

router.get("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const data = await fineReceiptModel.findOne({ id: id, active: true });
   if (!data) {
      return res.status(200).json({
         fetch: false,
         data: data,
         message: "Fine receipt id invalid!",
      });
   }
   return res.status(200).json({ fetch: true, data: data });
});

router.post("/", auth, validate(fineReceiptModel), async function (req, res) {
   const fineReceipt = req.body;
   const fine = await fineModel.findOne({ reader: fineReceipt.reader });
   if (!fine) {
      return res.status(201).json({ add: false, message: "Fine id invalid!" });
   }
   fineReceipt.active = true;
   await new fineReceiptModel(fineReceipt).save();
   await fineModel.updateOne(
      { reader: result.reader },
      { $set: { debt: result.remaining } }
   );
   return res.status(201).json({
      added: true,
      message: "Add fine receipt success!!!",
   });
});

router.delete("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const fineReceipt = await fineReceiptModel.findOne({ id: id, active: true });
   if (!fineReceipt) {
      return res
         .status(201)
         .json({ delete: false, message: "Fine receipt id invalid!" });
   }
   const fine = await fineModel.findOne({ reader: fineReceipt.reader });
   if (!fine) {
      return res
         .status(201)
         .json({ delete: false, message: "Fine id invalid!" });
   }
   //await fineReceipt.remove();
   await fineReceiptModel.updateOne({ id: id }, { $set: { active: false } });
   await fineModel.updateOne(
      { reader: fineReceipt.reader },
      { $set: { debt: fine.debt + fineReceipt.payment } }
   );
   return res.status(201).json({
      delete: true,
      message: "Delete fine receipt success!!!",
   });
});

module.exports = router;
