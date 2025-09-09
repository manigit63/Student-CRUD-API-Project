const jwt = require("jsonwebtoken");
const User = require("../models/users.model.js");

const auth = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader != "undefined") {
      const bearer = bearerHeader.split(" ");
      const token = bearer[1];
			
      const user = jwt.verify(token, process.env.JWT_SECRET);

      console.log(user);
      req.token = user;
      next();
    } else {
      res.status(401).json({ message: "No token Provided!" });
    }
  } catch (err) {
    res.status(403).json({ message: "Invalid and expired token!" });
  }
};

module.exports = auth