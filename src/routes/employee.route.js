const express = require("express");
const jwt = require("jsonwebtoken");
const employeeModel = require("../models/employee.model");
const EmployeeSchema = require("../models/employee.model");

const router = express.Router();

router.get("/", async function (req, res) {
   const data = await employeeModel.find({});
   res.json({ data: data });
});

router.get("/:id", async function (req, res) {
   const id = req.params.id || "0";
   const data = await employeeModel.findOne({ id: id });
   res.json({ data: data });
});

module.exports = router;
