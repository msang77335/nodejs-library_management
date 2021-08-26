const express = require("express");
const jwt = require("jsonwebtoken");
const employeeModel = require("../models/employee.model");
const authSchema = require("../models/auth.model");
const validate = require("../middleware/validate.mdw");
const bcryptjs = require("bcrypt");
const auth = require("../middleware/auth.mdw");

const router = express.Router();

router.get("/", auth, async function (req, res) {
   const employee = await employeeModel.findOne({
      id: req.accessTokenPayload.id,
   });
   employee.password = undefined;
   return res.json({ infomation: employee });
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
      id: employee.id,
      accessToken: accessToken,
      refreshToken: "refreshToken",
   });
});

module.exports = router;
