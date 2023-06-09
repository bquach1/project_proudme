require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authMiddleware = require("./authMiddleware");
const bcrypt = require('bcrypt');

const app = express();
const port = 3001;

const uri = process.env.REACT_APP_MONGODB_URI;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

// Define user schema and model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  schoolName: { type: String, required: true },
  birthMonth: { type: String, required: true },
  birthYear: { type: String, required: true },
  gradeLevel: { type: String, required: true },
  gender: { type: String, required: true },
});

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  goalType: {
    type: String,
    required: true,
  },
  behaviorValue: {
    type: Number,
  },
  goalValue: {
    type: Number,
  },
  divInfo1: {
    type: String,
  },
  divInfo2: {
    type: String,
  },
  reflection: {
    type: String,
  },
  date: {
    type: Date,
  },
  formattedDate: {
    type: String,
  },
  goalStatus: {
    type: String,
  },
});

const behaviorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  goalType: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
  formattedDate: {
    type: String,
  },
  goalValue: {
    type: Number,
  },
  behaviorValue: {
    type: Number,
  },
  goalStatus: {
    type: String,
  },
});

const Goal = mongoose.model("Goal", goalSchema);
const User = mongoose.model("User", userSchema);
const Behavior = mongoose.model("Behavior", behaviorSchema);

// Login endpoint
app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    // Check email and password against database
    const user = await User.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      // If login fails, return an error response
      res.status(401).send("Incorrect email or password");
      return;
    }

    // If login is successful, return a success response
    const token = jwt.sign({ userId: user._id }, "secret_key");
    res.send(token);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// Add goals endpoint
app.post("/goals", async (req, res) => {
  try {
    const existingGoalMaker = await Goal.findOne({
      user: req.body.user,
      goalType: req.body.goalType,
    });
    if (existingGoalMaker) {
      const goal = await Goal.findOneAndUpdate(
        {
          user: req.body.user,
          goalType: req.body.goalType,
        },
        {
          $set: {
            goalType: req.body.goalType,
            goalValue: req.body.goalValue,
            behaviorValue: req.body.behaviorValue,
            divInfo1: req.body.divInfo1,
            divInfo2: req.body.divInfo2,
            reflection: req.body.reflection,
            date: req.body.date,
            goalStatus:
              req.body.behaviorValue >= req.body.goalValue ? "yes" : "no",
          },
        },
        {
          new: true,
        }
      );
      res.status(200).json(goal);
    } else {
      const goal = new Goal({
        user: req.body.user,
        goalType: req.body.goalType,
        goalValue: req.body.goalValue,
        behaviorValue: req.body.behaviorValue,
        divInfo1: req.body.divInfo1,
        divInfo2: req.body.divInfo2,
        reflection: req.body.reflection,
        date: req.body.date,
        goalStatus: req.body.behaviorValue >= req.body.goalValue ? "yes" : "no",
      });
      const savedGoal = await goal.save();
      res.status(201).json(savedGoal);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add behaviors endpoint
app.post("/behaviors", async (req, res) => {
  try {
    const existingBehavior = await Behavior.findOne({
      user: req.body.user,
      goalType: req.body.goalType,
      date: req.body.date,
      formattedDate: req.body.formattedDate,
      goalValue: req.body.goalValue,
    });
    if (existingBehavior) {
      const behavior = await Behavior.findOneAndUpdate(
        {
          user: req.body.user,
          goalType: req.body.goalType,
          date: req.body.date,
          formattedDate: req.body.formattedDate,
          goalValue: req.body.goalValue,      
        },
        {
          $set: {
            behaviorValue: req.body.behaviorValue,
            goalStatus:
              req.body.behaviorValue >= req.body.goalValue ? "yes" : "no",
          },
        },
        {
          new: true,
        }
      );
      res.status(200).json(behavior);
    } else {
      const behavior = new Behavior({
        user: req.body.user,
        goalType: req.body.goalType,
        date: req.body.date,
        goalValue: req.body.goalValue,
        behaviorValue: req.body.behaviorValue,
        formattedDate: req.body.formattedDate,
        goalStatus:
          req.body.behaviorValue >= req.body.goalValue ? "yes" : "no",
      });
      const savedBehavior = await behavior.save();
      res.status(201).json(savedBehavior);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Signup endpoint
app.post("/signup", async (req, res) => {
  const email = req.body.email;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;
  const name = req.body.name;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const schoolName = req.body.schoolName;
  const birthMonth = req.body.birthMonth;
  const birthYear = req.body.birthYear;
  const gradeLevel = req.body.gradeLevel;
  const gender = req.body.gender;

  const salt = bcrypt.genSaltSync(10);

  const hashedPassword = bcrypt.hashSync(password, salt);
  password = hashedPassword;
  const hashedConfirmPassword = bcrypt.hashSync(confirmPassword, salt);

  try {
    // Check email against database to ensure it is not already in use
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If email is already in use, return an error response
      res.status(400).send("Email is already in use");
    } else if (password !== hashedConfirmPassword) {
      // If password and confirmPassword do not match, return an error response
      res.status(400).send("Passwords do not match");
    } else {
      // Create new user and save to database
      const newUser = new User({
        email,
        password,
        name,
        firstName,
        lastName,
        schoolName,
        birthMonth,
        birthYear,
        gradeLevel,
        gender,
      });
      await newUser.save();

      // Return a success response
      res.status(200).send(newUser);
    }
  } catch (error) {
    res.status(500).send("Internal server error");
    console.error(error);
  }
});

// User endpoint
app.get(
  "/users",
  authMiddleware.verifyToken,
  authMiddleware.attachUserId,
  async (req, res) => {
    try {
      const user = await User.findById(req._id);
      res.json(user);
    } catch (error) {
      res.status(500).send("Internal server error");
      console.error(error);
    }
  }
);

// User endpoint
app.get(
  "/allUsers",
  async (req, res) => {
    try {
      const allUsers = await User.find();
      res.json(allUsers);
    } catch (error) {
      res.status(500).send("Internal server error");
      console.error(error);
    }
  }
);

// Get all goals endpoint
app.get("/allGoals", async (req, res) => {
  try {
    const goals = await Goal.find();
    res.status(200).json(goals);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get goals endpoint
app.get("/goals", async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.query.user });
    res.status(200).json(goals);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get specific goal by goal type endpoint
app.get("/goalType", async (req, res) => {
  try {
    const goals = await Goal.find({
      user: req.query.user,
      goalType: req.query.goalType,
    });
    res.status(200).json(goals);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get by user behaviors endpoint
app.get("/behaviors", async (req, res) => {
  try {
    const behaviors = await Behavior.find({
      user: req.query.user,
    });
    res.status(200).json(behaviors);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get specific goal by goal type endpoint
app.get("/behaviorType", async (req, res) => {
  try {
    const behaviors = await Behavior.find({
      user: req.query.user,
      goalType: req.query.goalType,
    });
    res.status(200).json(behaviors);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all behaviors endpoint
app.get("/allBehaviors", async (req, res) => {
  try {
    const allBehaviors = await Behavior.find();
    res.status(200).json(allBehaviors);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get behaviors by user, date, and goalType
app.get("/dailyBehavior", async (req, res) => {
  try {
    const behaviorToday = await Behavior.find({
      user: req.query.user,
      goalType: req.query.goalType,
      formattedDate: req.query.formattedDate
    });
    res.status(200).json(behaviorToday);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
