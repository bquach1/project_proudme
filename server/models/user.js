const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
***REMOVED***,
  email: {
    type: String,
    required: true
***REMOVED***,
  password: {
    type: String,
    required: true
***REMOVED***,
  date: {
    type: Date,
    default: Date.now
***REMOVED***
***REMOVED***
module.exports = User = mongoose.model("users", UserSchema);