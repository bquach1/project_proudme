require("dotenv").config({ path: "../.env" });
const express = require("express");
const cron = require("node-cron");
const mongoose = require("mongoose");
const Behavior = require("./models/Behavior");
const User = require("./models/User");

const dbURI = process.env.REACT_APP_MONGODB_URI;

const createDefaultBehaviorEntry = async (
  user,
  goalType,
  formattedDate,
  today
) => {
  const existingBehavior = await Behavior.findOne({
    user,
    goalType,
    date: formattedDate,
  });

  if (!existingBehavior) {
    const defaultBehavior = new Behavior({
      user,
      name: user.name,
      goalType,
      goalValue: 0,
      behaviorValue: 0,
      date: formattedDate,
      dateToday: today,
      goalStatus: "no",
      divInfo1: "",
      divInfo2: "",
      reflection: "",
      recommendedValue: getDefaultRecommendedValue(goalType),
    });
    await defaultBehavior.save();
    console.log(
      `Default ${goalType} entry created for ${user} on ${formattedDate}`
    );
  }
};

const getDefaultRecommendedValue = (goalType) => {
  switch (goalType) {
    case "activity":
      return 60;
    case "screentime":
      return 120;
    case "eating":
      return 5;
    case "sleep":
      return 9;
    default:
      return 0;
  }
};

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB");

    const logBehaviors = async () => {
      try {
        const today = new Date();
        const formattedDate =
          today.getMonth() +
          1 +
          "/" +
          today.getDate() +
          "/" +
          today.getFullYear();

        const existingUsers = await User.find();

        for (const user of existingUsers) {
          await createDefaultBehaviorEntry(
            user,
            "activity",
            formattedDate,
            today
          );
          await createDefaultBehaviorEntry(
            user,
            "screentime",
            formattedDate,
            today
          );
          await createDefaultBehaviorEntry(
            user,
            "eating",
            formattedDate,
            today
          );
          await createDefaultBehaviorEntry(user, "sleep", formattedDate, today);
        }
      } catch (err) {
        console.error(`Error creating default entries: ${err.message}`);
      }
    };

    await logBehaviors();
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(`MongoDB connection error: ${err.message}`);
  });
