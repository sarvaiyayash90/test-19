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

app.use(function(req, res, next){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");//Authorization, sid
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

//app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded());

app.use(express.json());
//app.use(cors({origin:'http://localhost:3000'}))
app.use(cors())


/*  +--------------------------+
    |      Creare data         |
    +--------------------------+  */

app.post('/Createstudent', upload.single('profile'), async (req, res, next) => {


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
    profile_id: result.public_id,
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
app.post('/liststudent/:id', (req, res) => {
  student.find({ login_id: req.params.id })
    .exec()
    .then((result) => {
      //console.log("dsdssaas", result);
      res.status(200).send(result);
      //res.json(result);
    }).catch((err) => {
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

app.post('/viewstudent/:id', async (req, res) => {
  try {
    const student_new = await student.findById(req.params.id)
    res.status(200).json(student_new)
  } catch (err) {
    res.send('Error' + err)
  }
})

/*  +--------------------------+
    |     Edit data show       |
    +--------------------------+  */
app.get('/Editstudent/:id', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
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
app.put('/UpdateStudent/:id',upload.single('profile'), async (req, res) => {

  console.log("caac");

  if (req.file) 
  {
    const id = req.params.id;
    const delete_img = student.findById({ _id: id })
    delete_img.exec()
      .then((res) => {
        cloudinary.uploader.destroy(res.profile_id);
      })

      let result = await cloudinary.uploader.upload(req.file.path);

      student.updateOne({ _id: req.params.id }, {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email_id: req.body.email_id,
        Department: req.body.Department,
        contact_no: req.body.contact_no,
        address: req.body.address,
        birthday: req.body.birthday,
        graduation_year: req.body.graduation_year,
        profile: result.secure_url,
        profile_id: result.public_id,
        password: req.body.password,
      }, { new: true })
        .then((result) => {
          console.log(result)
          res.json(result)
          //res.status(200).json({ "status": "Successfully Updated...." })
        }).catch(err => {
          console.log(err);
          //res.status(500).json({ "status": "unSuccessfully Updated...." })
        }) 
  } 
  else 
  {
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

/*  +--------------------------+
    |        CSV Create        |
    +--------------------------+  */
app.get('/csv/:id',(req, res) => {
    student.find({ login_id: req.params.id })
        .exec()
        .then(result => {
            //console.log(result)
            const jsonData = JSON.parse(JSON.stringify(result));
            //console.log("jsonData", jsonData);
            var today = new Date();
            const ws = fs.createWriteStream('./CSV/' + 'DATA_INFO' + '_' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear() + '.csv');
            fastcsv
                .write(jsonData, { headers: true })
                .on("finish", function () {
                    console.log("Write to students.csv successfully!");
                })
                .pipe(ws);
            res.status(200).send(result)
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

/*  +-----------------------------------+
    |        fetch CSV generator        |
    +-----------------------------------+  */
app.get('/fetchcsv/:id',(req, res) => {
    console.log("call fetch data");
    student.find({ login_id: req.params.id })
        .exec()
        .then((result) => {
            var today = new Date();
            var CSV_DATA = 'DATA_INFO' + '_' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear() + '.csv'
            let inputStream = fs.createReadStream('./CSV/' + CSV_DATA,{headers:true});
            inputStream.pipe(res);
            // res.json({ msg: "data pass" }
        }).catch((err) => {
            res.json({ msg: "data not pass" })
        })
})

/*  +--------------------------+
    |        PDF Create        |
    +--------------------------+  */

app.post('/pdf/:id',(req, res) => {
    student.findById(req.params.id)
        .exec()
        .then(result => {
            var pdfDoc = new PDFDocument;
            var today = new Date();
            var pdfpath = path.join('./PDF/' + result.first_name + "_" + result.first_name + "_" + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear() + '.pdf');
            pdfDoc.pipe(fs.createWriteStream(pdfpath));
            pdfDoc.moveDown(0.5)
            pdfDoc
                .image('client/public/uploads/' + result.profile, {
                    fit: [400, 150],
                    align: 'center',
                    valign: 'center'
                });
            pdfDoc.moveDown(0.5)
            pdfDoc.fontSize(25)
            pdfDoc.text("First Name :- " + result.first_name);
            pdfDoc.text("Last Name :- " + result.last_name);
            pdfDoc.text("Email Id :- " + result.email_id);
            pdfDoc.text("Department :- " + result.Department);
            pdfDoc.text("Contact No :- " + result.contact_no);
            pdfDoc.text("Birthday :- " + result.birthday);
            pdfDoc.text("graduation year :- " + result.graduation_year);
            pdfDoc.text("Profile :- " + result.profile);
            pdfDoc.text("Password :- " + result.password);
            pdfDoc.end();
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

/*  +--------------------------------+
    |        Ftech Pdf Create        |
    +--------------------------------+  */
app.get('/fetchpdf/:id',(req, res) => {
    const id = req.params.id
    student.findById({ _id: id })
        .exec()
        .then(result => {
            var today = new Date();
            var Pdf_Data = result.first_name + "_" + result.first_name + "_" + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear() + ".pdf"
            //res.sendFile("./"+ Pdf_Data)
            var file = fs.createReadStream('./PDF/' + Pdf_Data);
            file.pipe(res);
        })
        .catch(err => {
            res.json({ msg: "errrooreor" })
        })
})

//====================================== login

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

