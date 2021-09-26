const express = require("express");
const jwt = require("jsonwebtoken");
const staffModel = require("../models/staff.model");
const authSchema = require("../models/auth.model");
const validate = require("../middleware/validate.mdw");
const bcryptjs = require("bcrypt");
const auth = require("../middleware/auth.mdw");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
   destination: "./public/uploads/",
   filename: (req, file, cb) => {
      cb(
         null,
         file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
   },
});

const upload = multer({ storage: storage });

router.get("/", auth, async function (req, res) {
   const staff = await staffModel.findOne({
      id: req.accessTokenPayload.id,
   });
   if (!staff) {
      return res.status(200).json({ author: false, user: staff });
   }
   staff.password = undefined;
   return res.status(200).json({ authenticated: true, user: staff });
});

router.post("/", auth, validate(authSchema), async function (req, res) {
   const { id, password } = req.body;

   const staff = await staffModel.findOne({
      id: id,
   });

   if (staff == null) {
      return res.json({ authenticated: false, message: "User id invalid!" });
   }

   if (bcryptjs.compareSync(password, staff.password) === false) {
      return res.json({
         authenticated: false,
         message: "User password incorrect!",
      });
   }

   const accessToken = jwt.sign({ id: staff.id }, process.env.SECRET_TOKEN);
   return res.json({
      authenticated: true,
      accessToken: accessToken,
      refreshToken: "refreshToken",
      message: "Login success!!!",
   });
});

router.patch("/password", auth, async function (req, res) {
   const { id } = req.accessTokenPayload;
   const { currentPassword, newPassword } = req.body;

   const staff = await staffModel.findOne({ id: id });

   if (staff == null) {
      return res.json({ update: false, message: "User id invalid!" });
   }

   if (bcryptjs.compareSync(currentPassword, staff.password) === false) {
      return res.json({
         update: false,
         message: "User current password incorrect!",
      });
   }

   const password = bcryptjs.hashSync(newPassword, 10);

   staffModel.updateOne({ id: id }, { $set: { password: password } });
   return res.json({ update: true, message: "Update password success!!!" });
});

router.patch(
   "/image",
   auth,
   upload.single("avatar"),
   async function (req, res) {
      const { id } = req.accessTokenPayload;
      const avatar = req.file;

      if (avatar === null) {
         return res.json({
            update: false,
            message: "Image not found!",
         });
      }

      staffModel.updateOne(
         { id: id },
         { $set: { image: `/uploads/${avatar.filename}` } }
      );
      return res.json({ update: true, message: "Update avatar success!!!" });
   }
);

module.exports = router;
