/* In User.js */
// Require mongoose in this file.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema.
const userSchema = new Schema({
  fname: String,
  lname: String,
  email: String,
  todos: JSON,
  created_at: Date,
  updated_at: Date
});


userSchema.pre('save', function(next) {
  // Get the current date.
  const currentDate = new Date();

  // If created_at doesn't exist, add to that field
  if (!this.created_at) {
      this.created_at = currentDate;
  }

  // Change the updated_at field to current date.
  this.updated_at = currentDate;

  // Continue.
  next();
});


userSchema.methods.summary = function() {
  // Construct and return summary.
  const summary = this.name + "\n" + this.email
  return summary;
}

// Create a model using schema.
const User = mongoose.model('User', userSchema);

// Make this available to our Node applications.
module.exports = User;