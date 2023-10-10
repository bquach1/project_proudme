require("dotenv").config({ path: "../.env" });
const express = require("express");
const cron = require("node-cron");
const mongoose = require("mongoose");
const Behavior = require("./models/Behavior");

const dbURI = process.env.REACT_APP_MONGODB_URI;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");

    // Define a cron job to run at midnight (00:00) every day
    cron.schedule("0 0 * * *", async () => {
      try {
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0];

        // Fetch all existing users from your MongoDB collection
        const existingUsers = await Behavior.distinct("user");

        // Iterate through each user and create/update the behavior entry
        for (const user of existingUsers) {
          const existingBehavior = await Behavior.findOne({
            user: user,
            goalType: "your_goal_type", // Replace with the actual goal type
            date: formattedDate,
          });

          if (!existingBehavior) {
            // Entry does not exist, create a new one with default values
            const behavior = new Behavior({
              user: user,
              name: "default_name", // Replace with the actual name
              goalType: "your_goal_type", // Replace with the actual goal type
              goalValue: 0, // Default goalValue set to 0
              behaviorValue: 0, // Default behaviorValue set to 0
              date: formattedDate,
              dateToday: today,
              goalStatus: "no", // Default goalStatus set to "no"
              divInfo1: "", // Default divInfo1
              divInfo2: "", // Default divInfo2
              reflection: "", // Default reflection
              recommendedValue: 0, // Default recommendedValue set to 0
            });
            await behavior.save();
            console.log(`Default entry created for ${user} on ${formattedDate}`);
          }
        }
      } catch (err) {
        console.error(`Error creating default entries: ${err.message}`);
      }
    });
  })
  .catch((err) => {
    console.error(`MongoDB connection error: ${err.message}`);
  });
