const express = require("express");
const cors = require("cors");

const analyzeRoutes = require("./Routes/analyzeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Analyze route
app.use("/api", analyzeRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Resume Optimizer API running"
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});