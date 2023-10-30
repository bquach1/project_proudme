const mongoose = require("mongoose");

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
  recommendedValue: {
    type: Number,
    default: 0,
  },
});

const Behavior = mongoose.model("Behavior", behaviorSchema);

module.exports = Behavior;