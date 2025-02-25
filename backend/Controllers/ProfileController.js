const express = require("express");
const router = express.Router();
const Profile = require("../Models/Profile"); 




router.get("/list", async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};

    if (email) {
      query.email = { $regex: email, $options: "i" }; 
    }

    const profiles = await Profile.find(query).sort({ date: -1 });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: "Error fetching profiles" });
  }
});


module.exports = router;