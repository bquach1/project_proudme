require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authMiddleware = require("./authMiddleware");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
const openai = require("openai");
const cron = require('node-cron');

const app = express();
const port = 3001;

const uri = process.env.REACT_APP_MONGODB_URI;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


app.use(express.json());


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
  isVerifiedEmail: { type: Boolean, default: true },
  verificationCode: { type: String },
});

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
  },
  goalType: {
    type: String,
    required: true,
  },
  goalValue: {
    type: Number,
  },
  behaviorValue: {
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
    type: String,
  },
  dateToday: {
    type: Date,
  },
  goalStatus: {
    type: String,
  },
  recommendedValue: {
    type: Number,
  },
});

const behaviorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
  },
  goalType: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
  dateToday: {
    type: Date,
  },
  goalValue: {
    type: Number,
  },
  behaviorValue: {
    type: Number,
    default: 0,
  },
  goalStatus: {
    type: String,
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
  feedback: {
    type: String,
  },
  recommendedValue: {
    type: Number,
    default: 0,
  },
  // New fields
  activities: {
    type: Object,
    default: {}
  },
  screentime: {
    type: Object,
    default: {}
  },
  servings: {
    type: Object,
    default: {}
  },
  sleep: {
    bedBehavior: Number,
    wakeUpBehavior: Number,
    bedGoal: Number,
    wakeUpGoal: Number
  },
});

const selectedItemsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Assuming each user has their own selected items
  activity: { type: Array, default: [] },
  screentime: { type: Array, default: [] },
  eating: { type: Array, default: [] },
  sleep: { type: Array, default: [] }
});

const goalInputsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activity: {
      type: Map,
      of: { hours: Number, minutes: Number }
  },
  screentime: {
      type: Map,
      of: { hours: Number, minutes: Number }
  },
  eating: {
      type: Map,
      of: { servings: Number}
  },
  sleep: {
      "Expected Sleep": {
          bedtime: { type: String},
          wakeUpTime: { type: String},
          hours: Number,
          minutes: Number
      }
  },
  date: {
    type: String,
    required: true
  },
});

const behaviorInputsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activity: {
      type: Map,
      of: { hours: Number, minutes: Number }
  },
  screentime: {
      type: Map,
      of: { hours: Number, minutes: Number }
  },
  eating: {
      type: Map,
      of: {servings: Number }
  },
  sleep: {
      "Actual Sleep": {
          bedtime: { type: String },
          wakeUpTime: { type: String},
          hours: Number,
          minutes: Number
      }
  },
  date: {
    type: String,
    required: true
  },
});

const chatbotResponseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  goalType: { type: String, required: true },
  feedback: { type: String, required: true },
  date: {
    type: String,
    required: true
  },
});



const ChatbotResponse = mongoose.model("ChatbotResponse", chatbotResponseSchema);
const BehaviorInputs = mongoose.model('BehaviorInputs', behaviorInputsSchema);
const GoalInputs = mongoose.model('GoalInputs', goalInputsSchema);
const SelectedItems = mongoose.model('SelectedItems', selectedItemsSchema);
const User = mongoose.model("User", userSchema);
const Behavior = mongoose.model("Behavior", behaviorSchema);
const Goal = mongoose.model("Goal", goalSchema);


//delete file everyday it passes 

cron.schedule('0 0 * * *', async () => {
  console.log('Running daily data reset job');

  try {
    // Clear the collections
    await SelectedItems.deleteMany({});
    // await GoalInputs.deleteMany({});
    // await BehaviorInputs.deleteMany({});
    // await ChatbotResponse.deleteMany({});

    console.log('Data reset successfully');
  } catch (error) {
    console.error('Error resetting data:', error);
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    // Check email and password against database
    const user = await User.findOne({
      $or: [{ email: email }, { name: email }],
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      // If login fails, return an error response
      res.status(401).send("Incorrect email or password");
      return;
    }

    // If login is successful, return a success response
    const token = jwt.sign({ userId: user._id }, "secret_key");
    console.log(`User with email ${email} logged in successfully.`)
    res.send(token);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// Registration endpoint
app.post("/register", async (req, res) => {
  const { email, password, confirmPassword, name, firstName, lastName, schoolName, birthMonth, birthYear, gradeLevel, gender } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send("Passwords do not match");
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code

  try {
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      firstName,
      lastName,
      schoolName,
      birthMonth,
      birthYear,
      gradeLevel,
      gender,
      isVerifiedEmail: true,
      verificationCode
    });
    await newUser.save();

    const msg = {
      to: email,
      from: "pklab@projectproudme.com",
      subject: "Email Verification",
      text: `Your verification code is: ${verificationCode}`,
    };

    sgMail.send(msg)
      .then(() => res.status(200).send("User registered. Please verify your email."))
      .catch((error) => {
        console.error(error);
        res.status(500).send("Failed to send verification email");
      });
  } catch (error) {
    res.status(500).send("Internal server error");
    console.error(error);
  }
});

// Email verification endpoint
app.post("/verify", async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("User not found");
    }

    if (user.verificationCode === code) {
      user.isVerifiedEmail = true;
      user.verificationCode = null; // Clear the verification code
      await user.save();
      res.status(200).send("Email verified successfully");
    } else {
      res.status(400).send("Invalid verification code");
    }
  } catch (error) {
    res.status(500).send("Internal server error");
    console.error(error);
  }
});

// Resend verification email endpoint
app.post("/send-code", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }) || await User.findOne({name: email});

    if (!user) {
      return res.status(400).send("User not found");
    }

    if (user.isVerifiedEmail) {
      return res.status(400).send("Email is already verified");
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = verificationCode;
    await user.save();

    const msg = {
      to: user.email,
      from: "pklab@projectproudme.com",
      subject: "Email Verification",
      text: `Your verification code is: ${verificationCode}`,
    };

    sgMail.send(msg)
      .then(() => res.send("Verification email sent successfully"))
      .catch((error) => {
        console.error(error);
        res.status(500).send("Failed to send verification email");
      });
  } catch (error) {
    res.status(500).send("Internal server error");
    console.error(error);
  }
});

app.post("/ChatbotResponse", async (req, res) => {
  const { userId, goalType, feedback, date } = req.body;

  console.log(date);

  // Check if all required fields are provided
  if (!userId || !goalType || !feedback || !date) {
    console.error("Missing required fields", { userId, goalType, feedback, date });
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await ChatbotResponse.findOneAndUpdate(
      { userId, goalType, date }, // Filter to find the existing document
      { feedback },         // Update the feedback field
      { upsert: true, new: true } // Create if not exists and return the updated document
    );
    console.log("Chatbot response saved:", response);
    res.status(200).json({ message: "Chatbot response saved", response });
  } catch (error) {
    console.error("Error saving chatbot response:", error);
    res.status(500).json({ error: "Failed to save chatbot response" });
  }
});

//post selected Items
app.post('/selectedItems', async (req, res) => {
  const { userId, activity, screentime, eating, sleep } = req.body;

  try {
      const existingItems = await SelectedItems.findOne({ userId });

      if (existingItems) {
          // Update if exists
          existingItems.activity = activity;
          existingItems.screentime = screentime;
          existingItems.eating = eating;
          existingItems.sleep = sleep;
          await existingItems.save();
          res.status(200).json({ message: 'Selected items updated' });
      } else {
          // Create new document if doesn't exist
          const newSelectedItems = new SelectedItems({ userId, activity, screentime, eating, sleep });
          await newSelectedItems.save();
          res.status(201).json({ message: 'Selected items saved' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to save selected items' });
  }
});
// Save goal inputs
app.post('/saveGoalInputs', async (req, res) => {
  const { userId, activity, screentime, eating, sleep, date } = req.body;
  try {
      const existingGoalInputs = await GoalInputs.findOne({ userId, date });

      if (existingGoalInputs) {
          // Update if exists
          existingGoalInputs.activity = activity;
          existingGoalInputs.screentime = screentime;
          existingGoalInputs.eating = eating;
          existingGoalInputs.sleep = sleep;
          await existingGoalInputs.save();

          res.status(200).json({ message: 'Goal inputs updated' });
      } else {
          // Create new document if it doesn't exist
          const newGoalInputs = new GoalInputs({ userId, activity, screentime, eating, sleep, date });
          await newGoalInputs.save();
          res.status(201).json({ message: 'Goal inputs saved' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to save goal inputs' });
  }
});

// Save behavior inputs
app.post('/saveBehaviorInputs', async (req, res) => {
  const { userId, activity, screentime, eating, sleep, date } = req.body;

  try {
      const existingBehaviorInputs = await BehaviorInputs.findOne({ userId, date });

      if (existingBehaviorInputs) {
          // Update if exists
          existingBehaviorInputs.activity = activity;
          existingBehaviorInputs.screentime = screentime;
          existingBehaviorInputs.eating = eating;
          existingBehaviorInputs.sleep = sleep;
          await existingBehaviorInputs.save();
          res.status(200).json({ message: 'Behavior inputs updated' });
      } else {
          // Create new document if it doesn't exist
          const newBehaviorInputs = new BehaviorInputs({ userId, activity, screentime, eating, sleep, date });
          await newBehaviorInputs.save();
          res.status(201).json({ message: 'Behavior inputs saved' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to save behavior inputs' });
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
            name: req.body.name,
            goalType: req.body.goalType,
            goalValue: req.body.goalValue,
            behaviorValue: req.body.behaviorValue,
            divInfo1: req.body.divInfo1,
            divInfo2: req.body.divInfo2,
            reflection: req.body.reflection,
            date: req.body.date,
            dateToday: req.body.dateToday,
            goalStatus: req.body.goalStatus,
            recommendedValue: req.body.recommendedValue,
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
        dateToday: req.body.dateToday,
        goalStatus: req.body.goalStatus,
        recommendedValue: req.body.recommendedValue,
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
    });
    
    const newBehaviorData = {
      dateToday: req.body.dateToday,
      behaviorValue: req.body.behaviorValue,
      name: req.body.name,
      goalValue: req.body.goalValue,
      goalStatus: req.body.goalStatus,
      divInfo1: req.body.divInfo1,
      divInfo2: req.body.divInfo2,
      reflection: req.body.reflection,
      recommendedValue: req.body.recommendedValue,
      feedback: req.body.feedback,
    };

    // Add new fields based on goalType
    if (req.body.goalType === "activity") {
      newBehaviorData.activities = req.body.activities;
    } else if (req.body.goalType === "screentime") {
      newBehaviorData.screentime = req.body.screentime;
    } else if (req.body.goalType === "eating") {
      newBehaviorData.servings = req.body.servings;
    } else if (req.body.goalType === "sleep") {
      newBehaviorData.sleep = req.body.sleep;
    }
    if (existingBehavior) {
      const behavior = await Behavior.findOneAndUpdate(
        {
          user: req.body.user,
          goalType: req.body.goalType,
          date: req.body.date,
        },
        { $set: newBehaviorData },
        { new: true }
      );
      res.status(200).json(behavior);
    } else {
      const behavior = new Behavior({
        user: req.body.user,
        ...newBehaviorData,
        goalType: req.body.goalType,
        date: req.body.date,
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
  const { email, password, confirmPassword, name, firstName, lastName, schoolName, birthMonth, birthYear, gradeLevel, gender } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send("Passwords do not match");
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const newUser = new User({
      email,
      password: hashedPassword,
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
    console.log(`User with email ${email} registered successfully.`)
    res.status(200).send(newUser);
  } catch (error) {
    res.status(500).send("Internal server error");
    console.error(error);
  }
});

app.get("/getChatbotResponses", async (req, res) => {
  const { userId, goalType, date } = req.query; // Retrieve both userId and goalType from query parameters
  try {
      const responses = await ChatbotResponse.findOne({ userId, goalType, date }); 
      res.status(200).json(responses);
  } catch (error) {
      console.error("Error fetching chatbot responses:", error);
      res.status(500).json({ error: "Failed to fetch chatbot responses" });
  }
});

app.get('/getSelectedItems', async (req, res) => {
  try {
    const { userId } = req.query;  // Get userId from query parameters
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const selectedItems = await SelectedItems.findOne({ userId });
    if (selectedItems) {
      res.status(200).json(selectedItems);
    } else {
      res.status(404).json({ error: "Selected items not found" });
    }
  } catch (error) {
    console.error("Error retrieving selected items:", error);
    res.status(500).json({ error: "Failed to retrieve selected items" });
  }
});

// Route to get goal inputs
app.get('/getGoalInputs', async (req, res) => {
  try {
    const { userId, date } = req.query;  // Get userId from query parameters
    if (!userId || !date) return res.status(400).json({ error: "User ID and date are required" });

    const goalInputs = await GoalInputs.findOne({ userId, date });
    if (goalInputs) {
      res.status(200).json(goalInputs);
    } else {
      res.status(404).json({ error: "Goal inputs not found" });
    }
  } catch (error) {
    console.error("Error retrieving goal inputs:", error);
    res.status(500).json({ error: "Failed to retrieve goal inputs" });
  }
});

// Route to get behavior inputs
app.get('/getBehaviorInputs', async (req, res) => {
  try {
    const { userId, date } = req.query;  // Get userId from query parameters
    if (!userId || !date) return res.status(400).json({ error: "User ID and date is required" });

    const behaviorInputs = await BehaviorInputs.findOne({ userId, date });
    if (behaviorInputs) {
      res.status(200).json(behaviorInputs);
    } else {
      res.status(404).json({ error: "Behavior inputs not found" });
    }
  } catch (error) {
    console.error("Error retrieving behavior inputs:", error);
    res.status(500).json({ error: "Failed to retrieve behavior inputs" });
  }
});

// User endpoint
app.get("/users", authMiddleware.verifyToken, authMiddleware.attachUserId, async (req, res) => {
  try {
    const user = await User.findById(req._id);
    res.json(user);
  } catch (error) {
    res.status(500).send("Internal server error");
    console.error(error);
  }
});

app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [{ email: req.query.email }, { name: req.query.email }],
    });
    res.json(user);
  } catch (error) {
    res.status(500).send("Internal server error");
    console.error(error);
  }
});

app.get("/userByName", async (req, res) => {
  try {
    const user = await User.find({ name: req.query.name });
    res.json(user);
  } catch (error) {
    res.status(500).send("Internal server error");
    console.error(error);
  }
});

app.post("/user", async (req, res) => {
  const user = await User.findOneAndUpdate(
    {
      email: req.body.email,
    },
    {
      $set: {
        password: req.body.password,
        confirmPassword: req.body.password,
      },
    }
  );
  res.status(200).json(user);
});

// User endpoint
app.get("/allUsers", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (error) {
    res.status(500).send("Internal server error");
    console.error(error);
  }
});

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

// Get specific goal by goal type and current date endpoint
app.get("/dateGoalType", async (req, res) => {
  try {
    const goals = await Goal.find({
      user: req.query.user,
      goalType: req.query.goalType,
      date: req.query.date,
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
      date: req.query.date,
    });
    res.status(200).json(behaviorToday);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/journals-date", async (req, res) => {
  try {

    const date = new Date(req.query.date);

    const last30Days = [];

    for (let i = 0; i < 30; i++) {
      const prevDate = new Date(date);
      prevDate.setDate(date.getDate() - i);
      const mm = prevDate.getMonth() + 1;
      const dd = prevDate.getDate();
      const yyyy = prevDate.getFullYear();
      last30Days.push(`${mm}/${dd}/${yyyy}`);
    }

    const last30DaysBehavior = await BehaviorInputs.find({
      userId: req.query.userId,
      date: { $in: last30Days }
    });

    const last30DaysGoals = await GoalInputs.find({
      userId: req.query.userId,
      date: { $in: last30Days }
    });
    
    const entryDatesForLast30Days = new Set();

    last30DaysBehavior.forEach(item => {
      entryDatesForLast30Days.add(item.date);
    });
    
    last30DaysGoals.forEach(item => {
      entryDatesForLast30Days.add(item.date);
    });

    res.status(200).json(Array.from(entryDatesForLast30Days));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/journals-date/v1", async (req, res) => {
  try {

    const date = new Date(req.query.date);

    const last30Days = [];

    for (let i = 0; i < 30; i++) {
      const prevDate = new Date(date);
      prevDate.setDate(date.getDate() - i);
      const mm = prevDate.getMonth() + 1;
      const dd = prevDate.getDate();
      const yyyy = prevDate.getFullYear();
      last30Days.push(`${mm}/${dd}/${yyyy}`);
    }

    const last30DaysBehavior = await Behavior.find({
      user: req.query.userId,
      date: { $in: last30Days }
    });
    
    const entryDatesForLast30Days = new Set();

    last30DaysBehavior.forEach(item => {
      entryDatesForLast30Days.add(item.date);
    });
    

    res.status(200).json(Array.from(entryDatesForLast30Days));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
app.post("/send-email", (req, res) => {
  const { to, subject, text } = req.body;
  const msg = {
    to,
    from: "pklab@projectproudme.com",
    subject,
    text,
  };

  sgMail
    .send(msg)
    .then(() => res.send("Email sent successfully"))
    .catch((error) => {
      console.error(error);
      res.status(500).send("Failed to send email");
    });
});


const openaiInstance = new openai({ apiKey: process.env.OPEN_AI_API_KEY });
const handleSave = async () => {
  // Log current selected items, goal inputs, and behavior inputs

  // Prepare the data to be sent
  const data = {
    user: user._id,
    // For activity, screentime, eating, and sleep, make sure values are passed correctly
    activities: selectedItems.activity.reduce((acc, item) => {
      acc[item] = {
        goal: `${goalInputs.activity[item]?.hours || 0} hours ${goalInputs.activity[item]?.minutes || 0} minutes`,
        behavior: `${behaviorInputs.activity[item]?.hours || 0} hours ${behaviorInputs.activity[item]?.minutes || 0} minutes`
      };
      return acc;
    }, {}),
    screentime: selectedItems.screentime.reduce((acc, item) => {
      acc[item] = {
        goal: `${goalInputs.screentime[item]?.hours || 0} hours ${goalInputs.screentime[item]?.minutes || 0} minutes`,
        behavior: `${behaviorInputs.screentime[item]?.hours || 0} hours ${behaviorInputs.screentime[item]?.minutes || 0} minutes`
      };
      return acc;
    }, {}),
    servings: selectedItems.eating.reduce((acc, item) => {
      acc[item] = {
        goal: `${goalInputs.eating[item]?.servings || 0} servings`,
        behavior: `${behaviorInputs.eating[item]?.servings || 0} servings`
      };
      return acc;
    }, {}),
    sleep: {
      bedGoal: goalInputs.sleep["Expected Sleep"]?.bedTime || "0",
      wakeUpGoal: goalInputs.sleep["Expected Sleep"]?.wakeUpTime || "0",
      bedBehavior: behaviorInputs.sleep["Actual Sleep"]?.bedTime || "0",
      wakeUpBehavior: behaviorInputs.sleep["Actual Sleep"]?.wakeUpTime || "0",
    },
  };

  // Log data before sending to the server

  try {
    const response = await axios.post("/chatbot", data);
    setAiResponse(response.data.chat_reply);
  } catch (error) {
    console.error("Error saving behavior: ", error);
  }
};


app.post("/chatbot", (req, res) => {
  const prompt = req.body.prompt;
  try {
    openaiInstance.chat.completions
    .create({
      model: "gpt-4o-mini",
      // model="gpt-4",
      messages: [
        {
          role: "system",
          content: /category\d/.test(JSON.stringify(prompt))
            ? "You are an feedback provider who provides feedback to user based on their screen time values\
            You are provided one of 9 categories listed below: based on categories. provide feedback \
            category 1: User did not achieve their goal and their screen time is more than double of their set goal, ask them to reduce there screen time further\
            category 2: User missed their goal but not by more than double, encourage them to work harder and reach the goal\
            category 3: User achieved their screen time goal, congratulate them and ask them to set their actual goal to recommended value \
            category 4: User achieved their set goal and recommended goal, congratulate them got meeting goal and praise them for setting goal better then recommended value \
            category 5: User has reduced their screen time by more than half of their goal value, they are champion and achiever, praise them for their achievement. \
            category 6: User has not yet set their goal or behavior values for screentime; tell them to enter valid values.\
            category 7: User has not yet set a behavior value, tell them that they haven't started working towards their goal yet.\
            category 8: Uer has not yet set a goal value, tell them to remember to set a goal before starting their behaviors.\
            category 9: Praise the user for working towards their goal \
            Keep your feedback encouraging and limited to 60 words\
            If there is a reflection provided as an input, incorporate it into your feedback."
            : "you will be provided a list of behavior/activity types, recommended goals, actual goals, actual values, percentage of actual goal achieved, percenatge of recommended goal achieved \
      you have to provide feedback based on percentage of goal achieved \
      If goal achieved is less than 50%, tell user to put extra effort and give them tips \
      If goal achieved is more than 50%, encourage them to reach the goal and keep it up \
      If they meet their goal, congratulate them and give high five\
      If their set goal is more than the recommended goal, praise them for setting goal more than recommended value \
      If the goal type is screentime, it is better if they do less than the specified goal/recommendation, if their goal and behavior is less than the recommended value congratulate them else encourage them to reduce their screentime  \
      if the goal type is sleep, 8-10 hours are a good range, less than 8 you have to encourage them to sleep more, more than 10 encourage them to have a healthy routine and do some exercise\
      so give feedback for the opposite case.\
      If they achieve more than 120% of goal, They nailed it. \
      Keep your feedback encouraging and limited to 50 words\
      Provide realistic feedback on how they can improve in the future\
      relevant to the goal type; for example, specific fruits/veggies to eat for eating, specific exercise methods for activity,\
      specific alternatives to laptops for screentime, specific sleep methods for sleep.\
      If the set goal is 0, tell the user to set a valid amount for their goal; if their behavior value is 0, tell them that they need to get started. If both values are 0, tell them that they need to save their progress for that goal.\
      If the user provides a reflection associated with the given behavior,\
      incorporate it into your feedback.",
        },
        { role: "user", content: JSON.stringify(prompt) },
      ],
      temperature: 0.9,
      max_tokens: 75,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
    })
    .then((response) => {
      const chat_reply = response.choices[0].message.content;
      res.json({ chat_reply });
    });
  } catch (error) {
    console.error("Chatbot error: ", error);
    res.status(500).json({ error: "Chatbot request failed" });
  }
});

app.post("/chatbot/v1", (req, res) => {
  const prompt = req.body.prompt;
  try {
    openaiInstance.chat.completions
    .create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "System Prompt for Feedback Generation (Coach Mode) \
                    Role Play & Motivation Style \
                      Assume the role of a knowledgeable, personable coach. \
                      Use a warm, supportive tone that respects autonomy. \
                      Emphasize competence and relatedness in line with self-determination theory. \
                    Input Data \
                      Behavior/Activity type \
                      Recommended goal \
                      Actual goal \
                      Actual value \
                      Percentage of actual goal achieved \
                      Percentage of recommended goal achieved \
                      (Optional) User reflection \
                    Feedback Rules \
                      Goal Achievement \
                        Less than 50%: Advise extra effort and provide specific improvement tips with encouragement. \
                        More than 50%: Motivate progress and reinforce the user’s competence. \
                        Exactly met: Congratulate warmly and offer a virtual high five. \
                        Exceeding 120%: Recognize that the user has nailed it and celebrate their success. \
                      Goals Exceeding Recommendation \
                        Praise the user for setting a goal higher than the recommended value, affirming their autonomy. \
                      Special Goal Types \
                        Screentime: Recommend lower values than specified. \
                        Sleep: \
                          Ideal range: 8–10 hours. \
                          Less than 8: Encourage more sleep and self-care. \
                          More than 10: Suggest adopting a healthy routine and incorporating exercise. \
                        Additional Requirements \
                          Word Limit: Keep feedback under 50 words. \
                          Improvement Tips: Provide realistic, goal-specific suggestions (e.g., specific fruits/veggies for eating, exercise methods for activity, alternatives to laptops for screentime, sleep strategies for sleep). \
                        Edge Cases: \
                          Set goal of 0: Advise the user to set a valid goal. \
                          Actual value of 0: Encourage the user to get started. \
                          Both values 0: Recommend that the user begin tracking progress for that goal. \
                        User Reflection: If provided, integrate it to enhance relatedness.",
        },
        { role: "user", content: JSON.stringify(prompt) },
      ],
      temperature: 0.9,
      max_tokens: 75,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
    })
    .then((response) => {
      const chat_reply = response.choices[0].message.content;
      res.json({ chat_reply });
    });
  } catch (error) {
    console.error("Chatbot error: ", error);
    res.status(500).json({ error: "Chatbot request failed" });
  }
});

app.get("/daily-report", async (req, res) => {
  const { userId, date } = req.query; // Retrieve both userId and goalType from query parameters

  if (!userId || !date) {
    res.status(400).send("User Id or date not provided.");
    return
  }

  try {
      const response = await Promise.all([
        GoalInputs.findOne({ userId, date }),
        BehaviorInputs.findOne({ userId, date }),
        Behavior.find({ user: userId, date }),
        ChatbotResponse.find({ userId, date }),
      ]);    

      const combinedResponse = {
        goals: response[0],
        behaviors: response[1],
        reflection: response[2],
        feedback: response[3],
      };
      

      res.status(200).json(combinedResponse);
  } catch (error) {
      console.error("Error fetching daily report:", error);
      res.status(500).json({ error: "Error fetching daily report"});
  }
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
