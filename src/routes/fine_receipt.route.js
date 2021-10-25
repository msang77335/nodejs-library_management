const express = require("express");
const auth = require("../middleware/auth.mdw");
const fineReceiptModel = require("../models/fine_receipt.model");
const fineModel = require("../models/fine.model");
const readerModel = require("../models/reader.model");
const validate = require("../middleware/validate.mdw");
const moment = require("moment");

const router = express.Router();

router.get("/", auth, async function (req, res) {
   const data = await fineReceiptModel.find({ active: true });
   if (!data) {
      return res.status(200).json({ fetch: false, data: data });
   }
   const allReader = await readerModel.find();
   const fineReceipt = data.map((value) => {
      currentReader = allReader.find((reader) => reader.id === value.reader);
      return {
         id: value.id,
         debt: value.debt,
         avtive: value.active,
         payment: value.payment,
         createBy: value.createBy,
         createDate: value.createDate,
         remaining: value.remaining,
         reader: {
            key: currentReader.id,
            value: `${currentReader.id} - ${currentReader.name}`,
         },
      };
   });
   return res.status(200).json({ fetch: true, data: fineReceipt });
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
   const reader = await readerModel.findOne({ id: data.reader });
   const fineReceipt = {
      id: data.id,
      debt: data.debt,
      avtive: data.active,
      payment: data.payment,
      createBy: data.createBy,
      createDate: data.createDate,
      remaining: data.remaining,
      reader: {
         key: reader.id,
         value: `${reader.id} - ${reader.name}`,
      },
   };
   return res.status(200).json({ fetch: true, data: fineReceipt });
});

router.post("/", auth, validate(fineReceiptModel), async function (req, res) {
   const fineReceipt = req.body;
   const fine = await fineModel.findOne({ reader: fineReceipt.reader });
   if (!fine) {
      return res.status(201).json({ add: false, message: "Fine id invalid!" });
   }
   const lastFireReceipt = await fineReceiptModel
      .find()
      .sort({ id: -1 })
      .limit(1);
   const lastId = lastFireReceipt[0].id.split(".")[1];
   const newId = "FR.".concat(
      (parseInt(lastId) + 1).toString().padStart(6, "0")
   );
   fineReceipt.id = newId;
   fineReceipt.remaining = fineReceipt.debt - fineReceipt.payment;
   fineReceipt.createDate = moment().format("MM-DD-YYYY");
   fineReceipt.active = true;
   await new fineReceiptModel(fineReceipt).save();
   await fineModel.updateOne(
      { reader: fineReceipt.reader },
      { $set: { debt: fineReceipt.remaining } }
   );
   console.log(fineReceipt);
   return res.status(201).json({
      add: true,
      message: "Add fine receipt success!!!",
   });
});

router.delete("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const lastFireReceipt = await fineReceiptModel
      .find()
      .sort({ id: -1 })
      .limit(1);
   if (id !== lastFireReceipt[0].id) {
      return res
         .status(201)
         .json({ delete: false, message: "Can't Delete Fine receipt!" });
   }

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
