const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const studentSchema = new mongoose.Schema({
  first_name: {
    type: String,
    require: true,
  },
  last_name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  phone: {
    type: String,
    require: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    require: true,
  },
  profile_pic: {
    type: String,
  },
});

studentSchema.plugin(mongoosePaginate);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
