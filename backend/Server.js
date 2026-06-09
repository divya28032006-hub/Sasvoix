require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const complaintRoutes = require("./routes/complaintRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SasVoix API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ❌ DELETE this line — never log your secret
// console.log(process.env.JWT_SECRET);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});