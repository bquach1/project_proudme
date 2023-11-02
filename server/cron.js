require("dotenv").config({ path: "../.env" });
const moment = require("moment-timezone");
const mongoose = require("mongoose");
const Behavior = require("./models/Behavior");
const User = require("./models/User");

const cstTimeZone = "America/Chicago";

const dbURI = process.env.REACT_APP_MONGODB_URI;

const createDefaultBehaviorEntry = async (
  user,
  goalType,
  formattedDate,
  today,
  divInfo1,
  divInfo2
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
      divInfo1: divInfo1,
      divInfo2: divInfo2,
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
        const currentDateInCST = moment.tz(cstTimeZone);
        const previousDayInCST = currentDateInCST.clone().subtract(1, "days");
        const formattedDate = previousDayInCST.format("MM/D/YYYY");

        const today = new Date(formattedDate);

        const existingUsers = await User.find();

        const activityDivInfo1 =
          "Get at least 60 minutes of physical activity per day.";
        const activityDivInfo2 =
          "Do exercises like running or playing sports for at least an hour a day.";

        const screentimeDivInfo1 = "Limit screentime to 2 hours a day.";
        const screentimeDivInfo2 =
          "Go outside instead of using tech like laptops, phones, and televisions.";

        const eatingDivInfo1 =
          "Eat 5 or more servings of fruits and/or vegetables.";
        const eatingDivInfo2 =
          "Reach target increments for servings of healthy foods.";

        const sleepDivInfo1 = "Get at least 9 hours of sleep a night.";
        const sleepDivInfo2 =
          "Sleep at least 9-11 hours a night to feel the best and most productive.";

        for (const user of existingUsers) {
          console.log(user);
          await createDefaultBehaviorEntry(
            user,
            "activity",
            formattedDate,
            today,
            activityDivInfo1,
            activityDivInfo2
          );
          await createDefaultBehaviorEntry(
            user,
            "screentime",
            formattedDate,
            today,
            screentimeDivInfo1,
            screentimeDivInfo2
          );
          await createDefaultBehaviorEntry(
            user,
            "eating",
            formattedDate,
            today,
            eatingDivInfo1,
            eatingDivInfo2
          );
          await createDefaultBehaviorEntry(
            user,
            "sleep",
            formattedDate,
            today,
            sleepDivInfo1,
            sleepDivInfo2
          );
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
