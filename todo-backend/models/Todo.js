/* In Todos.js */
// Require mongoose in this file.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema.
const todoSchema = new Schema({
  // id: String,
  task: {
    type: String,
    required: true,
  },  
  completeBy: {
    type: Boolean,
    // required: true,
    default: false,
  }, 
  completed: {
    type: String,
    default: "",
  }, 
  isComplete: {
    type: Boolean,
    // required: true,
    default: false,
  }, 
  isCleared: {
    type: Boolean,
    // required: true,
    default: false,
  }, 
  created_at: {
    type: Date,
    required: true,
  }, 
  updated_at: {
    type: Date,
    required: true,
  }, 
})


todoSchema.pre('save', function(next) {
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


// Create a model using schema.
const Todo = mongoose.model('Todo', todoSchema);

// Make this available to our Node applications.
module.exports = Todo;