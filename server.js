require('./db')

const mongoose = require('mongoose')
var express = require("express")
var bodyParser = require('body-parser')
var cors = require('cors')
const path = require('path');
require("dotenv").config();

const student = require('./Models/Student_Model'); // Model import
const login_schema = require('./Models/Login_Model'); // Login Model

const multer = require('multer'); // Multer one type image upload time call middleware

var fs = require('fs'); // file systems

const fastcsv = require("fast-csv"); // CSV

var PDFDocument = require('pdfkit'); // PDF

const cloudinary = require("./utills/cloudinary");
const upload = require("./utills/multer");


//var student_controller = require('./Controllers/Student_Controller')
// var login_controller = require('./Controllers/Login_Controller')

var app = express();

// app.use(function(req, res, next){
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");//Authorization, sid
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.header('Access-Control-Allow-Credentials', true);
//   next();
// });

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
//app.use(cors({origin:'http://localhost:3000'}))
app.use(cors())


/*  +--------------------------+
    |      Creare data         |
    +--------------------------+  */

app.post('/Createstudent', upload.single('profile'),async (req, res, next) => {


  let result = await cloudinary.uploader.upload(req.file.path);

  const student_new = new student({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email_id: req.body.email_id,
    Department: req.body.Department,
    contact_no: req.body.contact_no,
    address: req.body.address,
    birthday: req.body.birthday,
    graduation_year: req.body.graduation_year,
    profile: result.secure_url,
    profile_id:result.public_id,
    password: req.body.password,
    login_id: req.body.login_id
  })
  console.log("data", student_new);
  student_new.save()
    .then(result => {
      // console.log(result);
      res.status(200).json({ "status": "data insert successfully" });
    }).catch(err => {
      console.log(err);
      res.status(400).json({ "status": "data Not insert successfully" });
    })

})

/*  +--------------------------+
    |        List data         |
    +--------------------------+  */
app.get('/liststudent/:id', (req, res) => {
  console.log("cacasdsdasdsdad", req.params.id);
  console.log("req", req);

  student.find({ login_id: req.params.id })
    .then(result => {
      console.log("dsdssaas", result);
      res.status(200).send(result);
    }).catch(err => {
      console.log(err);
      res.status(500).send(err);
    })
})

/*  +--------------------------+
    |        Delete data       |
    +--------------------------+  */
app.delete('/deletestudent/:id', (req, res) => {
  const id = req.params.id;
  const delete_img = student.findById({ _id: id })
  delete_img.exec()
    .then(result => {
      cloudinary.uploader.destroy(result.profile_id, (err) => {
        if (err) {
            console.log(err);
        }
    })
})

  const delete_stu_data = student.remove({ _id: id })
  delete_stu_data.exec()
    .then(result => {
      //console.log(result);
      res.status(200).json({ status: "Successfully Deleted Image...." })
    }).catch(err => {
      //console.log(err);
      res.status(500).send("ERROR")
    })
})

/*  +--------------------------+
    |     Single data show     |
    +--------------------------+  */

app.get('/viewstudent/:id', async (req, res) => {
  try {
    const student_new = await student.findById(req.params.id)
    res.json(student_new)
  } catch (err) {
    res.send('Error' + err)
  }
})

/*  +--------------------------+
    |     Edit data show       |
    +--------------------------+  */
app.get('/Editstudent/:id', async (req, res) => {
  try {
    const student_new = await student.findById(req.params.id)
    res.status(200).json(student_new)
  } catch (err) {
    res.status(500).send(err)
  }
})

/*  +--------------------------+
    |        Update Data       |
    +--------------------------+  */
app.put('/UpdateStudent/:id',(req, res) => {

  //console.log("call");

  

    if (req.file) {
      
      const id = req.params.id;
      const delete_img = student.findById({ _id: id })
      delete_img.exec()
        .then((result) => {
          cloudinary.uploader.destroy(result.profile_id);

          let result_new = cloudinary.uploader.upload(req.file.path);


          student.updateOne({ _id: req.params.id }, {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email_id: req.body.email_id,
            Department: req.body.Department,
            contact_no: req.body.contact_no,
            address: req.body.address,
            birthday: req.body.birthday,
            graduation_year: req.body.graduation_year,
            profile: result_new.secure_url,
            profile_id:result_new.profile_id,
            password: req.body.password,
          }, { new: true })
            .then((result) => {
              console.log(result)
              //res.status(200).json({ "status": "Successfully Updated...." })
            }).catch(err => {
              console.log(err);
              //res.status(500).json({ "status": "unSuccessfully Updated...." })
            })
        })
    } else {
      student.updateOne({ _id: req.params.id }, {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email_id: req.body.email_id,
        Department: req.body.Department,
        contact_no: req.body.contact_no,
        address: req.body.address,
        birthday: req.body.birthday,
        graduation_year: req.body.graduation_year,
        password: req.body.password,
      }, { new: true })
        .then((result) => {
          console.log(result)
          //res.status(200).json({ "status": "Successfully Updated...." })
        }).catch(err => {
          console.log(err);
          //res.status(500).json({ "status": "unSuccessfully Updated...." })
        })
    }
    
})

// login

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

// app.get('*', (req, res) => {  res.sendFile(path.join(__dirname+'/client/public/index.html'));})

//app.use('/studentdata',student_controller); // Student controller
//app.use('/logindata',login_controller); 

// Login Controller

if (process.env.NODE_ENV === "production") {
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}



app.listen(process.env.PORT || 3100, () => { console.log("\n \t\t\t < Server Started At Port : (3100) > \n ") });

