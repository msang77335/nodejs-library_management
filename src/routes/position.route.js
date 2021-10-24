const express = require("express");
const auth = require("../middleware/auth.mdw");
const positionModel = require("../models/position.model");

const router = express.Router();

router.get("/", auth, async function (req, res) {
   const data = await positionModel.find({ active: true });
   if (!data) {
      return res.status(200).json({ fetch: false, data: data });
   }
   return res.status(200).json({ fetch: true, data: data });
});

router.get("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const data = await positionModel.findOne({ id: id, active: true });
   if (!data) {
      return res.status(200).json({
         fetch: false,
         data: data,
         message: "Staff Position id invalid!",
      });
   }
   return res.status(200).json({ fetch: true, data: data });
});

module.exports = router;
