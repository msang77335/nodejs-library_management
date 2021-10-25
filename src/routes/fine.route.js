const express = require("express");
const auth = require("../middleware/auth.mdw");
const fineModel = require("../models/fine.model");

const router = express.Router();

router.get("/", auth, async function (req, res) {
   const data = await fineModel.find({ active: true });
   if (!data) {
      return res.status(200).json({ fetch: false, data: data });
   }
   return res.status(200).json({ fetch: true, data: data });
});

router.get("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const data = await fineModel.findOne({ id: id, active: true });
   if (!data) {
      return res.status(200).json({
         fetch: false,
         data: data,
         message: "Fine id invalid!",
      });
   }
   return res.status(200).json({ fetch: true, data: data });
});

router.get("/reader/:readerId", auth, async function (req, res) {
   const readerId = req.params.readerId || "0";
   const data = await fineModel.findOne({ reader: readerId, active: true });
   if (!data) {
      return res.status(200).json({
         fetch: false,
         data: data,
         message: "Reader id invalid!",
      });
   }
   return res.status(200).json({ fetch: true, data: data });
});

module.exports = router;
