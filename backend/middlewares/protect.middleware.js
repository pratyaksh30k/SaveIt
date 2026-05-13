const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer "))
    return res.status(401).json({ message: "Not authenticated" });
  try {
    const { id } = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
    req.user = await User.findById(id).select("-password");
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
