const jwt = require("jsonwebtoken");
const Admin = require("../Models/Admin");

const authMiddleware = async (req, res, next) => {
  let token = req.cookies.token || req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); 

    const admin = await Admin.findById(decoded.id).select("id name email");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    req.admin = admin; 
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;