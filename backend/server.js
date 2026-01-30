require("./src/cron/markAbsent");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");

const app = express();
connectDB();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/users", require("./src/routes/user.routes"));
app.use("/api/attendance", require("./src/routes/attendance.routes"));
app.use("/api/leaves", require("./src/routes/leave.routes"));
app.use("/api/admin", require("./src/routes/admin.routes"));
app.use("/api/payroll", require("./src/routes/payroll.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}✅`);
});
