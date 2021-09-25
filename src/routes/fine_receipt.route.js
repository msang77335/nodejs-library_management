const express = require("express");
const auth = require("../middleware/auth.mdw");
const fineReceiptModel = require("../models/fine_receipt.model");
const fineModel = require("../models/fine.model");
const validate = require("../middleware/validate.mdw");

const router = express.Router();

router.get("/", auth, async function (req, res) {
   const data = await fineReceiptModel.find({});
   res.json({ data: data });
});

router.get("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const data = await fineReceiptModel.findOne({ id: id });
   res.json({ data: data });
});

router.post("/", validate(fineReceiptModel), async function (req, res) {
   const fineReceipt = req.body;
   const result = await new fineReceiptModel(fineReceipt).save();
   await fineModel.updateOne(
      { reader: result.reader },
      { $set: { debt: result.remaining } }
   );
   res.status(201).json({ fineReceipt: result, added: true });
});

router.delete("/:id", async function (req, res) {
   const id = req.params.id || "0";
   const fineReceipt = await fineReceiptModel.findOne({ id: id });
   const fine = await fineModel.findOne({ reader: fineReceipt.reader });
   if (!fineReceipt) {
      return res.status(201).json({ fineReceipt: fineReceipt, deleted: false });
   }
   const result = await fineReceipt.remove();
   await fineModel.updateOne(
      { reader: fineReceipt.reader },
      { $set: { debt: fine.debt + fineReceipt.payment } }
   );
   res.status(201).json({ fineReceipt: result, deleted: true });
});

module.exports = router;
