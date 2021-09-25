const express = require("express");
const staffModel = require("../models/staff.model");
const auth = require("../middleware/auth.mdw");
const validate = require("../middleware/validate.mdw");
const bcryptjs = require("bcrypt");

const router = express.Router();

router.get("/", async function (req, res) {
   const data = await staffModel.find({});
   res.json({ data: data });
});

router.get("/:id", async function (req, res) {
   const id = req.params.id || "0";
   const data = await staffModel.findOne({ id: id });
   res.json({ data: data });
});

router.post("/", validate(staffModel), async function (req, res) {
   const staff = req.body;
   staff.password = bcryptjs.hashSync(staff.phone, 10);
   const result = await new staffModel(staff).save();
   res.status(201).json({ staff: result, added: true });
});

router.patch("/:id", validate(staffModel), async function (req, res) {
   const id = req.params.id || "0";
   const newStaff = req.body;
   const staff = await staffModel.findOne({ id: id });
   if (!staff) {
      return res.status(201).json({ staff: staff, updated: false });
   }
   const result = await staffModel.updateOne({ id: id }, newStaff);
   res.status(201).json({ staff: result, updated: true });
});

router.delete("/:id", async function (req, res) {
   const id = req.params.id || "0";
   const staff = await staffModel.findOne({ id: id });
   if (!staff) {
      return res.status(201).json({ staff: staff, deleted: false });
   }
   const result = await staff.remove();
   res.status(201).json({ staff: result, deleted: true });
});

module.exports = router;
