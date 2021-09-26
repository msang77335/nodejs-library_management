const express = require("express");
const readerModel = require("../models/reader.model");
const fineModel = require("../models/fine.model");
const auth = require("../middleware/auth.mdw");
const validate = require("../middleware/validate.mdw");
const bcryptjs = require("bcrypt");

const router = express.Router();

router.get("/", auth, async function (req, res) {
   const data = await readerModel.find({});
   if (!data) {
      res.status(200).json({ fetch: false, data: data });
   }
   res.status(200).json({ fetch: true, data: data });
});

router.get("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const data = await readerModel.findOne({ id: id });
   if (!data) {
      res.status(200).json({
         fetch: false,
         data: data,
         message: "Reader id invalid!",
      });
   }
   res.status(200).json({ fetch: true, data: data });
});

router.post("/", auth, validate(readerModel), async function (req, res) {
   const reader = req.body;
   reader.password = bcryptjs.hashSync(reader.phone, 10);
   await new readerModel(reader).save();
   await new fineModel({ reader: reader.id, debt: 0 }).save();
   res.status(201).json({ adde: true, message: "Add reader success!!!" });
});

router.patch("/:id", auth, validate(readerModel), async function (req, res) {
   const id = req.params.id || "0";
   const newReader = req.body;
   const reader = await readerModel.findOne({ id: id });
   if (!reader) {
      return res
         .status(201)
         .json({ update: false, message: "Reader id invalid!" });
   }
   await readerModel.updateOne({ id: id }, newReader);
   res.status(201).json({ update: true, message: "Update reader success!!!" });
});

router.delete("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const reader = await readerModel.findOne({ id: id });
   if (!reader) {
      return res
         .status(201)
         .json({ delete: false, message: "Reader id invalid!" });
   }
   await reader.remove();
   res.status(201).json({
      delete: true,
      message: "Delete reader success!!!",
   });
});

module.exports = router;
