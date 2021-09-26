const express = require("express");
const staffModel = require("../models/staff.model");
const auth = require("../middleware/auth.mdw");
const validate = require("../middleware/validate.mdw");
const bcryptjs = require("bcrypt");

const router = express.Router();

router.get("/", auth, async function (req, res) {
   const data = await staffModel.find({});
   if (!data) {
      res.status(200).json({ fetch: false, data: data });
   }
   res.status(200).json({ fetch: true, data: data });
});

router.get("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const data = await staffModel.findOne({ id: id });
   if (!data) {
      res.status(200).json({
         fetch: false,
         data: data,
         message: "Staff id invalid!",
      });
   }
   res.status(200).json({ fetch: true, data: data });
});

router.post("/", auth, validate(staffModel), async function (req, res) {
   const staff = req.body;
   staff.password = bcryptjs.hashSync(staff.phone, 10);
   await new staffModel(staff).save();
   res.status(201).json({ add: true, message: "Update staff success!!!" });
});

router.patch("/:id", auth, validate(staffModel), async function (req, res) {
   const id = req.params.id || "0";
   const newStaff = req.body;
   const staff = await staffModel.findOne({ id: id });
   if (!staff) {
      return res
         .status(201)
         .json({ update: false, message: "Staff id invalid!" });
   }
   await staffModel.updateOne({ id: id }, newStaff);
   res.status(201).json({ update: true, message: "Update staff success!!!" });
});

router.delete("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const staff = await staffModel.findOne({ id: id });
   if (!staff) {
      return res
         .status(201)
         .json({ delete: false, message: "Staff id invalid!" });
   }
   const result = await staff.remove();
   res.status(201).json({ delete: true, message: "Delete staff success!!!" });
});

module.exports = router;
