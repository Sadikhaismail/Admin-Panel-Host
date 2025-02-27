const mongoose = require("mongoose");

mongoose.connection.on("error", (err) => {
  console.error("MongoDB Connection Error:", err);
});
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB Disconnected. Reconnecting...");
});
