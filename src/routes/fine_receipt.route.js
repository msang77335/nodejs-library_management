const express = require("express");
const auth = require("../middleware/auth.mdw");
const fineReceiptModel = require("../models/fine_receipt.model");
const fineModel = require("../models/fine.model");
const validate = require("../middleware/validate.mdw");

const router = express.Router();

router.get("/", auth, async function (req, res) {
   const data = await fineReceiptModel.find({});
   if (!data) {
      res.status(200).json({ fetch: false, data: data });
   }
   res.status(200).json({ fetch: true, data: data });
});

router.get("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const data = await fineReceiptModel.findOne({ id: id });
   if (!data) {
      res.status(200).json({
         fetch: false,
         data: data,
         message: "Fine receipt id invalid!",
      });
   }
   res.status(200).json({ fetch: true, data: data });
});

router.post("/", auth, validate(fineReceiptModel), async function (req, res) {
   const fineReceipt = req.body;
   const fine = await fineModel.findOne({ reader: fineReceipt.reader });
   if (!fine) {
      return res.status(201).json({ add: false, message: "Fine id invalid!" });
   }
   await new fineReceiptModel(fineReceipt).save();
   await fineModel.updateOne(
      { reader: result.reader },
      { $set: { debt: result.remaining } }
   );
   res.status(201).json({
      added: true,
      message: "Add fine receipt success!!!",
   });
});

router.delete("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const fineReceipt = await fineReceiptModel.findOne({ id: id });
   const fine = await fineModel.findOne({ reader: fineReceipt.reader });
   if (!fine) {
      return res
         .status(201)
         .json({ delete: false, message: "Fine id invalid!" });
   }
   if (!fineReceipt) {
      return res
         .status(201)
         .json({ delete: false, message: "Fine receipt id invalid!" });
   }
   await fineReceipt.remove();
   await fineModel.updateOne(
      { reader: fineReceipt.reader },
      { $set: { debt: fine.debt + fineReceipt.payment } }
   );
   res.status(201).json({
      delete: true,
      message: "Delete fine receipt success!!!",
   });
});

module.exports = router;
