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
  isVerifiedEmail: { type: Boolean, default: false },
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
    type: Map,
    of: new mongoose.Schema({
      goal: Number,
      behavior: Number,
    }),
  },
  screentime: {
    type: Map,
    of: new mongoose.Schema({
      goal: Number,
      behavior: Number,
    }),
  },
  servings: {
    fruits: Number,
    vegetables: Number,
  },
  sleep: {
    bedBehavior: Number,
    wakeUpBehavior: Number,
  },
});

const User = mongoose.model("User", userSchema);
const Behavior = mongoose.model("Behavior", behaviorSchema);


// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check email and password against database
    const user = await User.findOne({
      $or: [{ email: email }, { name: email }],
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      // If login fails, return an error response
      return res.status(401).send("Incorrect email or password");
    }

    if (!user.isVerifiedEmail) {
      return res.status(403).send("Email not verified");
    }

    const token = jwt.sign({ userId: user._id }, "secret_key");
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
      isVerifiedEmail: false,
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

    res.status(200).send(newUser);
  } catch (error) {
    res.status(500).send("Internal server error");
    console.error(error);
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
    console.log(allUsers);
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

app.post("/chatbot", (req, res) => {
  const prompt = req.body.prompt;
  console.log(prompt);
  try {
    openaiInstance.chat.completions
      .create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a feedback provider for health behaviors. Provide feedback based on the type of activity and user inputs. 
            Here are the options:
            - Physical Activity: Recommend at least 60 minutes of exercise daily.
            - Screentime: Suggest limiting screen time to under 2 hours daily.
            - Eating: Recommend consuming at least 5 servings of fruits and vegetables daily.
            - Sleep: Advise getting 9-11 hours of sleep nightly.
            There are no set goals for fruits and vegetables so dont talk about it for that category.
            If no goal is set for behaviors like eating or sleep, base feedback on recommended values only.
            Keep feedback encouraging and specific to the selected activities.`,
          },
          { role: "user", content: JSON.stringify(prompt) },
        ],
        temperature: 0.9,
        max_tokens: 100,
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


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

