const express = require("express");
const auth = require("../middleware/auth.mdw");
const messageModel = require("../models/message.model");
const staffModel = require("../models/staff.model");

const router = express.Router();

router.get("/:dstId", auth, async function (req, res) {
   const dstId = req.params.dstId || "0";
   const dstStaff = await staffModel.findOne({ id: dstId });
   if (!dstStaff) {
      return res
         .status(200)
         .json({ fetch: false, message: "Destination user invalid!" });
   }
   const { id } = req.accessTokenPayload;
   const data = await messageModel.find({
      $or: [
         { $and: [{ srcUser: id }, { dstUser: dstId }] },
         { $and: [{ srcUser: dstId }, { dstUser: id }] },
      ],
   });
   if (!data) {
      res.status(200).json({ fetch: false, data: data });
   }
   res.status(200).json({ fetch: true, data: data });
});

router.post("/:dstId", auth, async function (req, res) {
   const message = req.body;
   const dstId = req.params.dstId || "0";
   const dstStaff = await staffModel.findOne({ id: dstId });
   if (!dstStaff) {
      return res
         .status(200)
         .json({ fetch: false, message: "Destination user invalid!" });
   }
   const { id } = req.accessTokenPayload;
   const lastmessage = await messageModel
      .find({
         $or: [
            { $and: [{ srcUser: id }, { dstUser: dstId }] },
            { $and: [{ srcUser: dstId }, { dstUser: id }] },
         ],
      })
      .sort({ id: -1 })
      .limit(1);
   console.log(lastmessage);
   const lastId = lastmessage[0].id.split(".")[1];
   const newId = "M.".concat(
      (parseInt(lastId) + 1).toString().padStart(6, "0")
   );
   await new messageModel({ id: newId, ...message }).save();
   res.status(201).json({ add: true, message: "Add message success!!!" });
});

router.delete("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const message = await message.findOne({ id: id });
   if (!message) {
      return res
         .status(201)
         .json({ delete: false, message: "Message id invalid!" });
   }
   await message.remove();
   res.status(201).json({
      delete: true,
      message: "Delete message success!!!",
   });
});

module.exports = router;
