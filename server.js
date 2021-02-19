require('./db')

var express = require("express")
var bodyParser = require('body-parser')
var cors = require('cors')
const path = require('path');
require("dotenv").config();

var student_controller = require('./Controllers/Student_Controller')
// var login_controller = require('./Controllers/Login_Controller')

var app = express();

app.use(function(req, res, next){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");//Authorization, sid
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors())

/*
+--------------------------+
|      Login Check         |
+--------------------------+  */

app.post('/Login', (request, res) => {

  console.log("Body Data", request.body)

  var email = request.body.email_id;
  var password = request.body.password;

  if (email && password) {
    login_schema.find({ email_id: email, password: password }, function (err, user) {
      if (user.length > 0) {
        console.log("Login Successfully");
        //request.session.loggedin = true;
        // request.session.username = request.body.email_id;
        // console.log("s",request.session.username);
        res.status(200).send({
          user: user,
          auth: true,
          session: user[0]._id,
          message: "Login successfully"
        })
      }
      else {
        res.status(404).send({
          auth: false,
          message: "Incorrect Username and/or Password!"
        })
        console.log("Incorrect Username and/or Password!");
      }
      res.end()
    });
    //request.session.username = request.body.email_id;
    //console.log("go",request.session.username)
  }
  else {
    res.status(500).send({ message: "Please enter Username and Password!" })
    res.send('Please enter Username and Password!');
    res.end();
  }

})

/*  +--------------------------+
    |     Single data show     |
    +--------------------------+  */

app.get('/viewloginprofile/:id', async (req, res) => {
  try {
    const login_schema_new = await login_schema.findById(req.params.id)
    //console.log(login_schema_new);
    res.json(login_schema_new)
  } catch (err) {
    res.send('Error' + err)
  }
})

app.use('/studentdata',student_controller); // Student controller
// app.use('/logindata',login_controller);  // Login Controller

if (process.env.NODE_ENV === "production") {
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(process.env.PORT || 3100, () => { console.log("\n \t\t\t < Server Started At Port : (3100) > \n ") });

