require('./db')

const mongoose = require('mongoose')
var express = require("express")
var bodyParser = require('body-parser')
var cors = require('cors')
const path = require('path');
require("dotenv").config();

const student = require('./Models/Student_Model'); // Model import

const multer = require('multer'); // Multer one type image upload time call middleware

var fs = require('fs'); // file systems

const fastcsv = require("fast-csv"); // CSV

var PDFDocument = require('pdfkit'); // PDF


//var student_controller = require('./Controllers/Student_Controller')
var login_controller = require('./Controllers/Login_Controller')

var app = express();

app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");//Authorization, sid
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
//app.use(cors({origin:'http://localhost:3000'}))
app.use(cors())

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'client/public/uploads');
  },
  filename: function (req, file, cb) {
      photo_name = Date.now() + path.extname(file.originalname)
      //cb(null, file.originalname)
      cb(null, photo_name);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
  } else {
      cb(null, false);
  }
}

/*  +--------------------------+
    |      Creare data         |
    +--------------------------+  */

app.post('/Createstudent',(req, res, next) => {

      let upload = multer({ storage: storage, fileFilter: fileFilter }).single('profile');
  
      upload(req, res, function (err) {
  
          const student_new = new student({
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email_id: req.body.email_id,
              Department: req.body.Department,
              contact_no: req.body.contact_no,
              address: req.body.address,
              birthday: req.body.birthday,
              graduation_year: req.body.graduation_year,
              profile: photo_name,
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
  })
  
  /*  +--------------------------+
      |        List data         |
      +--------------------------+  */
app.get('/liststudent/:id',(req, res) => {
    console.log("cacasdsdasdsdad",req.params.id);
    console.log("req",req);

    student.find({ login_id: req.params.id })
        .then(result => {
            console.log("dsdssaas",result);
            res.status(200).send(result);
        }).catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
})
  
  /*  +--------------------------+
      |        Delete data       |
      +--------------------------+  */
app.delete('/deletestudent/:id',(req, res) => {
    const id = req.params.id;
    const delete_img = student.findById({ _id: id })
    delete_img.exec()
        .then(result => {
            fs.unlink("client/public/uploads/" + result.profile, (err) => {
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

app.get('/viewstudent/:id',async (req, res) => {
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
app.get('/Editstudent/:id',async(req, res) => {
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

    let upload = multer({ storage: storage, fileFilter: fileFilter }).single('profile');

    upload(req, res, function (err) {

        //console.log("data", req.body);
        //console.log("file", photo_name);

        if (req.file) {
            const id = req.params.id;
            const delete_img = student.findById({ _id: id })
            delete_img.exec()
                .then((result) => {
                    fs.unlink("client/public/uploads/" + result.profile, ((err) => {
                        if (err) { console.log(err); }
                        else {
                            student.updateOne({ _id: req.params.id }, {
                                first_name: req.body.first_name,
                                last_name: req.body.last_name,
                                email_id: req.body.email_id,
                                Department: req.body.Department,
                                contact_no: req.body.contact_no,
                                address: req.body.address,
                                birthday: req.body.birthday,
                                graduation_year: req.body.graduation_year,
                                profile: photo_name,
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
                    }))
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
})
  
// app.get('*', (req, res) => {  res.sendFile(path.join(__dirname+'/client/public/index.html'));})

//app.use('/studentdata',student_controller); // Student controller

// Login Controller

if(process.env.NODE_ENV === "production"){
  app.use(express.static('client/build'))
  app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client/build','index.html'));
  });
}

app.use('/logindata',login_controller); 

app.listen(process.env.PORT || 3100,()=>{console.log("\n \t\t\t < Server Started At Port : (3100) > \n ")});

