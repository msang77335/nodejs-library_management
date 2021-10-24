const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const staffSchema = new Schema(
   {
      id: { type: String },
      name: { type: String, require: true },
      image: { type: String },
      email: { type: String, require: true },
      birthDay: { type: String, require: true },
      address: { type: String, require: true },
      phone: { type: String, require: true },
      degree: { type: String, require: true },
      position: { type: String, require: true },
      part: { type: String, require: true },
      password: { type: String },
      active: { type: Boolean },
      createBy: { type: String, require: true },
      createDate: { type: String },
   },
   { collection: "staff" }
);

const staff = mongoose.models.Staff || mongoose.model("staff", staffSchema);

module.exports = staff;
