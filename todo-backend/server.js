/* In your main JS file */
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// require the mongoose models
const User = require('./models/User');
const Todo = require('./models/Todo')
const ObjectId = require('mongoose').Types.ObjectId; 


const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

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
const saltRounds = 10
const secretkey = "secretkey"



// Create instance of Mongoose and connect to our local
// MongoDB database at the directory specified earilier.
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/todos')

// Tell Mongoose to use ES6 Promises for its promises
mongoose.Promise = global.Promise;

// Log to console any errors or a successful connection.
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
	console.log("Connected to db at /data/db/")
})

app.post('/login', (req, res) => {
  const { username, password } = req.body

  // Or by username:

  User.findOne({"username": username})
    .then(user => {
      // console.log(user)
      // if(user.length > 0) {
        // console.log(user.hash)
        bcrypt.compare(password, user.hash)
          .then((result) => {
            // console.log(result)
            if(result) {
              //If we have a valid user, create jwt token with
              //the secret key
              let token = jwt.sign({
                username
              }, secretkey)
              //send the token back to the user
              res.json({ 
                token,
                fname: user.fname
              })
            }
            //if the result is false, send back a null token
            else res.json({token: null})
        })
      //If we didn't find the user, send back a null token
      // } else {
      //   res.json({token: null, msg: 'Incorrect Username...'})
      // } 
    })
    .catch(err => {
        res.json({
          success: false,
          msg: 'Incorrect Request'
        })
    })
})


app.get('/usertodos', authorize, (req, res) => {
  const username = req.decoded.username
  // console.log(username)
  // let userData = db.collection(username)

  // userData.find().toArray().then(todos => {
    db.collection(username).find().toArray().then(todos => {
    res.json({
      todos: todos
    })
  })
})

//Register a new user
app.post('/register', (req, res) => {
  // console.log(req)
  const { fname, lname, username, password } = req.body
  // create an instance of the User
  // note: it hasn't been saved to the database yet
  bcrypt.hash(password, saltRounds)
  .then((hash) => {
    let newUser = User(
      {
        fname: fname,
        lname: lname,
        username: username,
        hash: hash,
      }
    )
    // // save the newly created User in the database
    newUser.save()
      .then(User => {
        db.createCollection(User.username)
        db.collection(User.username).insert(
          new Todo({ task: 'Install the Todo App'})
        )
        console.log(`User [${User.username}] created.`)
      })
      .catch(err => {
        console.log(err);
      })
    res.json({
      success: true
    })
  })
})  

//Add new Todo
app.post('/addtodo', authorize, (req, res) => {
  const username = req.decoded.username
  const { task } = req.body
  db.collection(username).insert(new Todo({ task: task }))
  res.json({
    success: true
  })
})

app.post('/updatetodo', authorize, (req, res) => {
  const username = req.decoded.username
  console.log(req.body)
  const { _id, task, completeBy, completed, isComplete, isCleared } = req.body

  db.collection(username).findOneAndUpdate(
    {_id: new ObjectId(_id)}, 
    { task: task,
      completeBy: completeBy,
      completed: completed,
      isComplete: isComplete,
      isCleared: isCleared
    })
      .then(updatedTodo => {
        res.send(updatedTodo)
        console.log(updatedTodo)
      })
      .catch(error => {
        console.log(error)
      })
})

app.post('/clearcompleted', authorize, (req, res) => {
  const username = req.decoded.username

  db.collection(username).deleteMany({isComplete: true})
    .then(response => {
      res.send(response)
      console.log(response)
    })
})

// // Update
// let update = {
//   username:'yu.123456789@gmail.com'
// }

// let query = {"_id":"5aa0471fd046a9248c75d16e"};

// // new:true means that the findOneAndUpdate method will return the updated object instead of the original
// // runValidators:true forces mongoose to run the validators specified in the schema (like required or max/mins), normally these only run on save and not on update
// let options = {
//   new:true,
//   runValidators:true
// }

// User.findOneAndUpdate(query, update, options)
//   .then(updatedUser => {
//       console.log(updatedUser._id + ' has been updated...');
//   })
//   .catch(err => {
//       console.log(err);
//   })

// Delete a User
// User.findOneAndRemove({"email":"yu.2@gmail.com"})
//   .then(removedUser => {
//       console.log(removedUser);
//       console.log("User Removed");
//   })
//   .catch(err => {
//       console.log(err);
//   })


  app.listen(port, () => {
    console.log(`Listening to port ${port}...`)
  })