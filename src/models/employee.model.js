const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema(
   {
      id: { type: String, require: true },
      name: { type: String, require: true },
      image: { type: String },
      email: { type: String, require: true },
      birth_day: { type: String, require: true },
      address: { type: String, require: true },
      phone: { type: String, require: true },
      degree: { type: String, require: true },
      position: { type: String, require: true },
      part: { type: String, require: true },
      password: { type: String, require: true },
   },
   { collection: "employee" }
);

const employee =
   mongoose.models.Employee || mongoose.model("employee", employeeSchema);

module.exports = employee;
