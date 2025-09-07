const mongoose = require("mongoose");
require("dotenv").config();

const Student = require("./models/students.model");

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/students-crud";

const students = [
  {
    first_name: "Amit",
    last_name: "Sharma",
    email: "amit.sharma@example.com",
    phone: "9876543210",
    gender: "Male",
    profile_pic: "1745298904695.jpg",
  },
  {
    first_name: "Priya",
    last_name: "Singh",
    email: "priya.singh@example.com",
    phone: "8765432109",
    gender: "Female",
    profile_pic: "1745524438332.jpg",
  },
  {
    first_name: "Rahul",
    last_name: "Verma",
    email: "rahul.verma@example.com",
    phone: "7654321098",
    gender: "Male",
    profile_pic: "1745526797455.jpg",
  },
  {
    first_name: "Sneha",
    last_name: "Gupta",
    email: "sneha.gupta@example.com",
    phone: "6543210987",
    gender: "Female",
    profile_pic: "1745568935425.jpg",
  },
  {
    first_name: "Rohan",
    last_name: "Patel",
    email: "rohan.patel@example.com",
    phone: "5432109876",
    gender: "Male",
    profile_pic: "1745576396488.jpg",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await Student.insertMany(students);
    console.log("Five students inserted successfully!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("Error inserting students:", err);
  }
}

seed();
