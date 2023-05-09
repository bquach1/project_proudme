require('dotenv').config({ path: '../.env' })
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authMiddleware = require('./authMiddleware');

const app = express();
const port = 3001;

const uri = process.env.REACT_APP_MONGODB_URI;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
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

const User = mongoose.model('User', userSchema);

// Login endpoint
app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    // Check email and password against database
    const user = await User.findOne({ email, password });

    if (!user) {
      // If login fails, return an error response
      res.status(401).send('Incorrect email or password');
    } 
    
    // If login is successful, return a success response
    const token = jwt.sign({ userId: user._id }, 'secret_key');
    res.send(token); 

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const name = req.body.name;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const schoolName = req.body.schoolName;
  const birthMonth = req.body.birthMonth;
  const birthYear = req.body.birthYear;
  const gradeLevel = req.body.gradeLevel;
  const gender = req.body.gender;

  try {
    // Check email against database to ensure it is not already in use
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If email is already in use, return an error response
      res.status(400).send('Email is already in use');
    } else if (password !== confirmPassword) {
      // If password and confirmPassword do not match, return an error response
      res.status(400).send('Passwords do not match');
    } else {
      // Create new user and save to database
      const newUser = new User({ email, password, name, firstName, lastName, schoolName, birthMonth, birthYear, gradeLevel, gender });
      await newUser.save();

      // Return a success response
      res.status(200).send(newUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// User endpoint
app.get('/users', authMiddleware.verifyToken, authMiddleware.attachUserId, async (req, res) => {
  try {
    const user = await User.findById(req._id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// app.get('/users/:userId/profile', authMiddleware.verifyToken, authMiddleware.attachUserId, async (req, res) => {
//   try {
//     const user = await User.findById(req._id);
//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal server error');
//   }
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
