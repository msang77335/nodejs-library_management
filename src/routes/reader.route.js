const express = require("express");
const readerModel = require("../models/reader.model");
const fineModel = require("../models/fine.model");
const readerCategoryModel = require("../models/reader_category.model");
const auth = require("../middleware/auth.mdw");
const validate = require("../middleware/validate.mdw");
const moment = require("moment");

const router = express.Router();

router.get("/", auth, async function (req, res) {
   const data = await readerModel.find({ active: true });
   if (!data) {
      return res.status(200).json({ fetch: false, data: data });
   }
   const allCategory = await readerCategoryModel.find();
   const readerList = data.map((value) => {
      currentCategory = allCategory.find(
         (category) => category.id === value.category
      );
      return {
         id: value.id,
         name: value.name,
         address: value.address,
         email: value.email,
         birthDay: value.birthDay,
         createBy: value.createBy,
         createDate: value.createDate,
         phone: value.phone,
         avtive: value.active,
         category: {
            key: currentCategory.id,
            value: currentCategory.name,
         },
      };
   });
   return res.status(200).json({ fetch: true, data: readerList });
});

router.get("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const data = await readerModel.findOne({ id: id, active: true });
   if (!data) {
      return res.status(200).json({
         fetch: false,
         data: data,
         message: "Reader id invalid!",
      });
   }
   const readerCategory = await readerCategoryModel.findOne({
      id: data.category,
   });
   const reader = {
      id: data.id,
      name: data.name,
      category: { key: readerCategory.id, value: readerCategory.name },
      address: data.address,
      email: data.email,
      birthDay: data.birthDay,
      createBy: data.createBy,
      createDate: data.createDate,
      phone: data.phone,
      active: data.active,
   };
   return res.status(200).json({ fetch: true, data: reader });
});

router.post("/", auth, validate(readerModel), async function (req, res) {
   const reader = req.body;
   const lastReader = await readerModel.find().sort({ id: -1 }).limit(1);
   const lastId = lastReader[0].id.split(".")[1];
   const newId = "R.".concat(
      (parseInt(lastId) + 1).toString().padStart(6, "0")
   );
   reader.active = true;
   reader.id = newId;
   reader.birthDay = moment(reader.birthDay).format("MM-DD-YYYY");
   reader.createDate = moment().format("MM-DD-YYYY");
   await new readerModel(reader).save();
   const lastFine = await fineModel.find().sort({ id: -1 }).limit(1);
   const lastIdFine = lastFine[0].id.split(".")[1];
   const newIdFine = "F.".concat(
      (parseInt(lastIdFine) + 1).toString().padStart(6, "0")
   );
   await new fineModel({
      id: newIdFine,
      reader: reader.id,
      debt: 0,
      active: true,
   }).save();
   return res.status(201).json({ add: true, message: "Add reader success!!!" });
});

router.patch("/:id", auth, validate(readerModel), async function (req, res) {
   const id = req.params.id || "0";
   const newReader = req.body;
   newReader.birthDay = moment(newReader.birthDay).format("MM-DD-YYYY");
   const reader = await readerModel.findOne({ id: id, active: true });
   if (!reader) {
      return res
         .status(201)
         .json({ update: false, message: "Reader id invalid!" });
   }
   await readerModel.updateOne({ id: id }, newReader);
   return res
      .status(201)
      .json({ update: true, message: "Update reader success!!!" });
});

router.delete("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const reader = await readerModel.findOne({ id: id, active: true });
   if (!reader) {
      return res
         .status(201)
         .json({ delete: false, message: "Reader id invalid!" });
   }
   //await reader.remove();
   await readerModel.updateOne({ id: id }, { $set: { active: false } });
   return res.status(201).json({
      delete: true,
      message: "Delete reader success!!!",
   });
});

module.exports = router;
