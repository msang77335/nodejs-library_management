const express = require("express");
const staffModel = require("../models/staff.model");
const positionModel = require("../models/position.model");
const degreeModel = require("../models/degree.model");
const partModel = require("../models/part.model");
const auth = require("../middleware/auth.mdw");
const validate = require("../middleware/validate.mdw");
const bcryptjs = require("bcrypt");
const moment = require("moment");

const router = express.Router();

router.get("/", auth, async function (req, res) {
   const data = await staffModel.find({ active: true });
   if (!data) {
      res.status(200).json({ fetch: false, data: data });
   }
   Promise.all([positionModel.find(), degreeModel.find(), partModel.find()])
      .then((values) => {
         const staff = data.map((value) => {
            currentPosition = values[0].find(
               (position) => position.id === value.position
            );
            currentDegree = values[1].find(
               (degree) => degree.id === value.degree
            );
            currentPart = values[2].find((part) => part.id === value.part);
            return {
               id: value.id,
               name: value.name,
               address: value.address,
               image: value.image,
               phone: value.phone,
               email: value.email,
               createBy: value.createBy,
               createDate: value.createDate,
               position: {
                  key: currentPosition.id,
                  value: currentPosition.name,
               },
               degree: {
                  key: currentDegree.id,
                  value: currentDegree.name,
               },
               part: {
                  key: currentPart.id,
                  value: currentPart.name,
               },
            };
         });
         return res.status(200).json({ fetch: true, data: staff });
      })
      .catch(() =>
         res
            .status(200)
            .json({ fetch: false, data: data, message: "Fetch Staff fail" })
      );
});

router.get("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const data = await staffModel.findOne({ id: id, active: true });
   if (!data) {
      return res.status(200).json({
         fetch: false,
         data: data,
         message: "Staff id invalid!",
      });
   }
   const staff = {
      id: data.id,
      image: data.image,
      name: data.name,
      address: data.address,
      email: data.email,
      phone: data.phone,
      birthDay: data.birthDay,
      createBy: data.createBy,
      createDate: data.createDate,
      active: data.active,
   };
   Promise.all([
      positionModel.findOne({ id: data.position }),
      degreeModel.findOne({ id: data.degree }),
      partModel.findOne({ id: data.part }),
   ])
      .then((values) => {
         staff.position = { key: values[0].id, value: values[0].name };
         staff.degree = { key: values[1].id, value: values[1].name };
         staff.part = { key: values[2].id, value: values[2].name };
         return res.status(200).json({ fetch: true, data: staff });
      })
      .catch(() =>
         res.status(200).json({
            fetch: false,
            data: data,
            message: "Staff id invalid!",
         })
      );
});

router.post("/", auth, validate(staffModel), async function (req, res) {
   const staff = req.body;
   const lastStaff = await staffModel.find().sort({ id: -1 }).limit(1);
   const lastId = lastStaff[0].id.split(".")[1];
   const newId = "S.".concat(
      (parseInt(lastId) + 1).toString().padStart(6, "0")
   );
   staff.id = newId;
   staff.image = "/uploads/default.png";
   staff.birthDay = moment(staff.birthDay).format("MM-DD-YYYY");
   staff.createDate = moment().format("MM-DD-YYYY");
   staff.password = bcryptjs.hashSync(staff.phone, 10);
   staff.active = true;
   await new staffModel(staff).save();
   return res.status(201).json({ add: true, message: "Add staff success!!!" });
});

router.patch("/:id", auth, validate(staffModel), async function (req, res) {
   const id = req.params.id || "0";
   const newStaff = req.body;
   newStaff.birthDay = moment(newStaff.birthDay).format("MM-DD-YYYY");
   const staff = await staffModel.findOne({ id: id, active: true });
   if (!staff) {
      return res
         .status(201)
         .json({ update: false, message: "Staff id invalid!" });
   }
   await staffModel.updateOne({ id: id }, newStaff);
   return res
      .status(201)
      .json({ update: true, message: "Update staff success!!!" });
});

router.delete("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const staff = await staffModel.findOne({ id: id, active: true });
   if (!staff) {
      return res
         .status(201)
         .json({ delete: false, message: "Staff id invalid!" });
   }
   // await staff.remove();
   await staffModel.updateOne({ id: id }, { $set: { active: false } });
   return res
      .status(201)
      .json({ delete: true, message: "Delete staff success!!!" });
});

module.exports = router;
