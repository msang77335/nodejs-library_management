const express = require("express");
const jwt = require("jsonwebtoken");
const employeeModel = require("../models/employee.model");
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
   const employee = await employeeModel.findOne({
      id: req.accessTokenPayload.id,
   });
   employee.password = undefined;
   return res.json({ user: employee });
});

router.post("/", validate(authSchema), async function (req, res) {
   const { id, password } = req.body;

   const employee = await employeeModel.findOne({
      id: id,
   });

   if (employee == null) {
      return res.json({ authenticated: false });
   }

   if (bcryptjs.compareSync(password, employee.password) === false) {
      return res.json({ authenticated: false });
   }

   const accessToken = jwt.sign({ id: employee.id }, process.env.SECRET_TOKEN);
   return res.json({
      authenticated: true,
      accessToken: accessToken,
      refreshToken: "refreshToken",
   });
});

router.patch("/password", auth, async function (req, res) {
   const { id } = req.accessTokenPayload;
   const { currentPassword, newPassword } = req.body;

   const employee = await employeeModel.findOne({ id: id });

   if (employee == null) {
      return res.json({ updated: false });
   }

   if (bcryptjs.compareSync(currentPassword, employee.password) === false) {
      return res.json({ updated: false });
   }

   const password = bcryptjs.hashSync(newPassword, 10);

   employeeModel.updateOne(
      { id: id },
      { $set: { password: password } },
      (err) => {
         if (err) {
            return res.json({
               updated: false,
            });
         } else {
            return res.json({
               updated: true,
            });
         }
      }
   );
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
            updated: false,
            message: "Image not found!",
         });
      }

      employeeModel.updateOne(
         { id: id },
         { $set: { image: `/uploads/${avatar.filename}` } },
         (err) => {
            if (err) {
               return res.json({
                  updated: false,
               });
            } else {
               return res.json({
                  updated: true,
               });
            }
         }
      );
   }
);

module.exports = router;
