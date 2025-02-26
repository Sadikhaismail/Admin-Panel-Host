const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./Config/DB");
const authRoutes = require("./Controllers/AdminController")
const ProfileRoutes = require ("./Controllers/ProfileController")

dotenv.config();
const app = express();


connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  })
);

app.use("/api/admin", authRoutes);
app.use("/api/profile", ProfileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));