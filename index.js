require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// connect mongodb
main().catch((err) => console.log(err));

// user schema
const { Schema } = mongoose;
const userModel = new Schema(
  { displayName: { type: String, required: true } },
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
  }
);

async function main() {
  await mongoose.connect(process.env.DB_URI);
}

app.get("/", (req, res) => {
  res.send("Track-task on coming soon....");
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
