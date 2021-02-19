require('./db')

var express = require("express")
var bodyParser = require('body-parser')
var cors = require('cors')
const path = require('path');
require("dotenv").config();

var student_controller = require('./Controllers/Student_Controller')
var login_controller = require('./Controllers/Login_Controller')

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



app.use('/studentdata',student_controller); // Student controller
app.use('/logindata',login_controller);  // Login Controller

if (process.env.NODE_ENV === "production") {
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(process.env.PORT || 3100, () => { console.log("\n \t\t\t < Server Started At Port : (3100) > \n ") });

