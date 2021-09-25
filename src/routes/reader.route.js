const express = require("express");
const readerModel = require("../models/reader.model");
const auth = require("../middleware/auth.mdw");
const validate = require("../middleware/validate.mdw");
const bcryptjs = require("bcrypt");

const router = express.Router();

router.get("/", async function (req, res) {
   const data = await readerModel.find({});
   res.json({ data: data });
});

router.get("/:id", async function (req, res) {
   const id = req.params.id || "0";
   const data = await readerModel.findOne({ id: id });
   res.json({ data: data });
});

router.post("/", validate(readerModel), async function (req, res) {
   const reader = req.body;
   reader.password = bcryptjs.hashSync(reader.phone, 10);
   const result = await new readerModel(reader).save();
   res.status(201).json({ reader: result, added: true });
});

router.patch("/:id", validate(readerModel), async function (req, res) {
   const id = req.params.id || "0";
   const newReader = req.body;
   const reader = await readerModel.findOne({ id: id });
   if (!reader) {
      return res.status(201).json({ reader: reader, updated: false });
   }
   const result = await readerModel.updateOne({ id: id }, newReader);
   res.status(201).json({ reader: result, updated: true });
});

router.delete("/:id", async function (req, res) {
   const id = req.params.id || "0";
   const reader = await readerModel.findOne({ id: id });
   if (!reader) {
      return res.status(201).json({ reader: reader, deleted: false });
   }
   const result = await reader.remove();
   res.status(201).json({ reader: result, deleted: true });
});

module.exports = router;
