/* In your main JS file */
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
//Import the jwt library
const jwt = require('jsonwebtoken')

const port = process.argv[2] || 8181

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(bodyParser.json())

//Authorizing Middleware. This will look at the token and see if 
//it is valid. If it is, continue, if it is not, send back an error
//message
function authorize(req, res, next) {
  //get the token from the header of the request
  const token = req.headers.authorization

  //Verify the token using the secret key
  jwt.verify(token, secretkey, (err, decoded) => {
    //if the token is not valid, send back an error
    if(err) {
      res.status(403).json({ success: false, message: 'Unauthorized'})
    } else {
      //If the token is valid, add the decoded information to the
      //request and pass control on to the next function.
      req.decoded = decoded
      next()
    }
  })
}
// require the mongoose model from Users.js
const User = require('./models/User');

// Create instance of Mongoose and connect to our local
// MongoDB database at the directory specified earilier.
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todos');

// Tell Mongoose to use ES6 Promises for its promises
mongoose.Promise = global.Promise;

// Log to console any errors or a successful connection.
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log("Connected to db at /data/db/")
});


app.get('/usertodos', (req, res) => {
  const 
})

//Register a new user
app.post('/register', (req, res) => {
  console.log(req.body)
  const { fname, lname, email, password } = req.body
  // create an instance of the User
  // note: it hasn't been saved to the database yet
  let newUser = User(
    {
      fname: fname,
      lname: lname,
      email: email,
      todos: [
        { 
          id: 1, 
          task: 'Install Todo App', 
          completeBy: null, 
          completed: null, 
          isComplete: false, 
          isCleared: false 
        }
      ]
    }
  )
  // // save the newly created User in the database
  newUser.save()
    .then(User => {
        console.log(`User [${User.fname}] created.`)
    })
    .catch(err => {
        console.log(err);
    })

  res.send("You have been registered!!!!")
})  



// // look for all users in the database
// User.find({})
//   .then(users => {
//       //returns an array of objects
//       console.log(users);
//   })
//   .catch(err => {
//       console.log(err);
//   })

// // Search through all and get a summary
// User.find({})
//   .then(users => {
//       // loop through the array of users
//       for(let i = 0; i < users.length; i++){
//           // each user has a summary method attached to it
//           users[i].summary();
//       }
//   })
//   .catch(err => {
//       console.log(err);
//   })

// // Or by address:
// User.find({"email": "yu.eugene90@gmail.com"})
//   .then(users => {
//       console.log(users);
//   })
//   .catch(err => {
//       console.log(err);
//   })


// Update
let update = {
  email:'yu.123456789@gmail.com'
}

let query = {"_id":"5aa035e89a9c3e2b089cc830"};

// new:true means that the findOneAndUpdate method will return the updated object instead of the original
// runValidators:true forces mongoose to run the validators specified in the schema (like required or max/mins), normally these only run on save and not on update
let options = {
  new:true,
  runValidators:true
}

User.findOneAndUpdate(query, update, options)
  .then(updatedUser => {
      console.log(updatedUser._id + ' has been updated...');
  })
  .catch(err => {
      console.log(err);
  })

// Delete a User
// User.findOneAndRemove({"email":"yu.2@gmail.com"})
//   .then(removedUser => {
//       console.log(removedUser);
//       console.log("User Removed");
//   })
//   .catch(err => {
//       console.log(err);
//   })


app.get('/usertodos', (req, res) => {
  //return user todos
  const user = req.body.user

 
})


  app.listen(port, () => {
    console.log(`Listening to port ${port}...`)
  })