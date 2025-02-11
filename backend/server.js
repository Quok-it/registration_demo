const express = require("express"); // Importing express
const cors = require("cors"); // Importing cors
const app = express(); // Creating an express app

app.use(cors()); // Using cors middleware
app.use(express.json()); // Middleware to parse JSON request bodies

// Create a route that sends a response when visiting the homepage
app.get("/", (req, res) => {
  res.send("<h1>Hello, Express.js Server!</h1>");
});

// New registration route
app.post("/register", (req, res) => {
  const { email, password, gpuModel, staticIp } = req.body;
  // Handle registration logic here (e.g. save to DB)
  res.json({
    message: "Registration successful",
    data: { email, password, gpuModel, staticIp },
  });
});

// Set up the server to listen on port 3000
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
