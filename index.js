require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
async function main() {
  try {
    await mongoose.connect(process.env.DB_URI);
  } catch (error) {
    console.log("MongDB connection error:", error);
  }
}
main();

// user schema
const { Schema } = mongoose;
const userSchema = new Schema({
  displayName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
});

// task schema
const taskSchema = new Schema({
  title: { type: String, maxlength: 50, required: true },
  description: { type: Schema.Types.Mixed, maxlength: 200 },
  timeStamp: { type: Date, default: Date.now },
  category: { type: String, required: true },
  email: { required: true, type: String },
});

// Model
const Users = mongoose.model("Users", userSchema);
const Tasks = mongoose.model("Tasks", taskSchema);

//   user related api
app.post("/users", async (req, res) => {
  try {
    const { email, displayName } = req.body;

    // validate
    if (!email || !displayName) {
      return res
        .status(400)
        .json({ message: "Email and displayName are required" });
    }

    // check email exist
    const emailExist = await Users.findOne({ email });
    if (emailExist) {
      return res.status(200).json({
        success: true,
        data: emailExist,
        message: "You have successfully logged in.",
      });
    }

    const result = await Users.insertOne({ email, displayName });
    res.status(200).json({
      success: true,
      data: result,
      message: "You have successfully logged in.",
    });
  } catch (err) {
    console.log(err);
  }
});

// tasks related apis
app.get("/tasks/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const result = await Tasks.find({ email });
    res.status(200).json({
      success: true,
      data: result,
      message: "Fetched all tasks success",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
});

// create tasks
app.post("/tasks", async (req, res) => {
  try {
    const task = req.body;
    console.log(task);
    // validate
    if (!task) {
      return res.status(400).json({ message: "Task are required" });
    }
    const result = await Tasks.insertOne(task);
    res.status(201).json({
      success: true,
      data: result,
      message: "Added new task!",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
});

// update tasks
app.put("/tasks/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const task = req.body;
    const result = await Tasks.updateOne(
      { _id: new ObjectId(id) },
      { $set: task }
    );
    res.status(200).json({
      success: true,
      data: result,
      message: "tasks has successfully updated!",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
});

// delete tasks
app.delete("/tasks/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Tasks.deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({
      success: true,
      data: result,
      message: "Successfully deleted!",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Track-task on coming soon....");
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
