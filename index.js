require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const cors = require("cors");
const app = express();
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { type } = require("node:os");
const { timeStamp } = require("node:console");
const server = createServer(app, { connectionStateRecovery: {} });

const port = process.env.PORT || 5000;
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST", "PATCH", "PUT", "DELETE"] },
});
// middleware
cors({
  origin: "*",
  methods: "GET, POST, PUT, DELETE",
  credentials: true,
});

app.use(express.json());

// MongoDB connection
async function main() {
  try {
    await mongoose.connect(process.env.DB_URI, {
      serverSelectionTimeoutMS: 50000, // 50 seconds timeout
    });
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

// notification schema
const notificationsSchema = new Schema({
  category: { type: String },
  email: { type: String },
  status: { type: String },
  timeStamp: { type: String },
  title: { type: String },
});

// Model
const Users = mongoose.model("Users", userSchema);
const Tasks = mongoose.model("Tasks", taskSchema);
const Notifications = mongoose.model("Notifications", notificationsSchema);

// connect socket
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("tasks", async (tasks) => {
    try {
      const { toDo, InProgress, done } = tasks;

      // update category
      const updateToDo =
        toDo.length !== 0
          ? toDo.map((toDoTask) => ({ ...toDoTask, category: "to-do" }))
          : [];
      const updateInProgress =
        InProgress.length !== 0
          ? InProgress.map((InProgressTask) => ({
              ...InProgressTask,
              category: "in-progress",
            }))
          : [];
      const updateDone =
        done.length !== 0
          ? done.map((DoneTask) => ({ ...DoneTask, category: "done" }))
          : [];

      const mergedObject = [...updateToDo, ...updateInProgress, ...updateDone];

      // update DB Collection
      if (mergedObject.length > 0) {
        const result = await Promise.all(
          mergedObject.map((task) =>
            Tasks.updateOne(
              { _id: new ObjectId(task._id) },
              { $set: { category: task.category } }
            )
          )
        );

        // check task modified for  notifications
        const updatedTask = mergedObject.map((task, index) =>
          result[index].modifiedCount > 0
            ? {
                title: task.title,
                category: task.category,
                timeStamp: new Date().toISOString(),
                status: "unseen",
                email: task.email,
              }
            : null
        );

        // send notifications client site
        const notification = updatedTask.filter((task) => task !== null);
        if (notification.length > 0) {
          socket.emit("notification", notification[0]);

          // insert notification to server
          const result = await Notifications.insertOne(notification[0]);
          console.log(result);
        }
      }
    } catch (error) {
      console.log("Socket operation ERROR:", error.message);
    }
  });

  // user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnect");
  });
});

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
app.get("/tasks", async (req, res) => {
  try {
    const result = await Tasks.find({});
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
app.patch("/tasks/:id", async (req, res) => {
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

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
