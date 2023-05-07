const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3001;

const uri = process.env.REACT_APP_MONGODB_URI;

console.log(uri);

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
  console.error(uri);
});

// Define user schema and model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Login endpoint
app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    // Check email and password against database
    const user = await User.findOne({ email, password });

    if (user) {
      // If login is successful, return a success response
      res.status(200).send('Login successful');
    } else {
      // If login fails, return an error response
      res.status(401).send('Incorrect email or password');
    }
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
      const newUser = new User({ email, password });
      await newUser.save();

      // Return a success response
      res.status(200).send('Signup successful');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
