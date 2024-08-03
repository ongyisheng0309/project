import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import userRoutes from "./routes/userRoutes.js";
import fetch from 'node-fetch'; 

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/simple-crud-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Serve static files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/users", userRoutes);

// Route for root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/flags/:countryCode", async (req, res) => {
  try {
    const countryCode = req.params.countryCode;
    const flagApiUrl = `https://flagsapi.com/${countryCode}/shiny/64.png`;
    
    const response = await fetch(flagApiUrl);

    if (!response.ok) {
      throw new Error(`Error fetching flag: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    res.set("Content-Type", "image/png");
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Error fetching flag:", error);
    res.status(500).send("Error fetching flag");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
