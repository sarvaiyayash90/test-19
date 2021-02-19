const express = require('express');  // Express
const router = express.Router(); // Router

const student = require('../Models/Student_Model'); // Model import
let path = require('path'); // path
const multer = require('multer'); // Multer one type image upload time call middleware
var fs = require('fs'); // file systems
const fastcsv = require("fast-csv"); // CSV
var PDFDocument = require('pdfkit'); // PDF

const cloudinary = require("../utills/cloudinary");
const upload = require("../utills/multer");

// const path = require('path'); //path

// multer photo upload
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

// fileFilter: (req, file, cb) => {
//     if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
//         cb(null, true);
//     } else {
//         cb(null, false);
//         return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//     }
// }


/*  +--------------------------+
    |      global Token store  |
    +--------------------------+  */

// router.route('/token_data_store/:id').post((req, res) => {
//     global.Token_Key = req.params.id
//     return res.json({ messgae: "global token call" })
// })

/*  +--------------------------+
    |      Creare data         |
    +--------------------------+  */


router.post('/Createstudent', upload.single('profile'), async (req, res, next) => {

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
router.get('/liststudent/:id', (req, res) => {
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
router.delete('/deletestudent/:id', (req, res) => {
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
router.get('/viewstudent/:id', async (req, res) => {
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
router.get('/Editstudent/:id', async (req, res) => {
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
router.put('/UpdateStudent/:id', upload.single('profile'), async (req, res) => {

    console.log("caac");


    if (req.file) {
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
    else {
        try{
            await student.findOneAndUpdate(req.params.id,req.body)
            res.status(200).json({ status:"ok"})
        }catch(err){
            res.status(400).send({erros:err})
        }
        // student.updateOne({ _id: req.params.id }, {
        //     first_name: req.body.first_name,
        //     last_name: req.body.last_name,
        //     email_id: req.body.email_id,
        //     Department: req.body.Department,
        //     contact_no: req.body.contact_no,
        //     address: req.body.address,
        //     birthday: req.body.birthday,
        //     graduation_year: req.body.graduation_year,
        //     password: req.body.password,
        // }, { new: true })
        //     .then((result) => {
        //         console.log(result)
        //         //res.status(200).json({ "status": "Successfully Updated...." })
        //     }).catch(err => {
        //         console.log(err);
        //         //res.status(500).json({ "status": "unSuccessfully Updated...." })
        //     })
    }
})


/*  +--------------------------+
    |        CSV Create        |
    +--------------------------+  */
// router.get('/csv/:id',(req, res) => {
//     student.find({ login_id: req.params.id })
//         .exec()
//         .then(result => {
//             //console.log(result)
//             const jsonData = JSON.parse(JSON.stringify(result));
//             //console.log("jsonData", jsonData);
//             var today = new Date();
//             const ws = fs.createWriteStream('./CSV/' + 'DATA_INFO' + '_' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear() + '.csv');
//             fastcsv
//                 .write(jsonData, { headers: true })
//                 .on("finish", function () {
//                     console.log("Write to students.csv successfully!");
//                 })
//                 .pipe(ws);
//             res.status(200).send(result)
//         })
//         .catch(err => {
//             res.status(500).send(err)
//         })
// })
    
/*  +-----------------------------------+
    |        fetch CSV generator        |
    +-----------------------------------+  */
// router.get('/fetchcsv/:id',(req, res) => {
//     console.log("call fetch data");
//     student.find({ login_id: req.params.id })
//         .exec()
//         .then((result) => {
//             var today = new Date();
//             var CSV_DATA = 'DATA_INFO' + '_' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear() + '.csv'
//             let inputStream = fs.createReadStream('./CSV/' + CSV_DATA,{headers:true});
//             inputStream.pipe(res);
//             // res.json({ msg: "data pass" }
//         }).catch((err) => {
//             res.json({ msg: "data not pass" })
//         })
// })

/*  +--------------------------+
    |        PDF Create        |
    +--------------------------+  */

// router.post('/pdf/:id',(req, res) => {
//     student.findById(req.params.id)
//         .exec()
//         .then(result => {
//             var pdfDoc = new PDFDocument;
//             var today = new Date();
//             var pdfpath = path.join('./PDF/' + result.first_name + "_" + result.first_name + "_" + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear() + '.pdf');
//             pdfDoc.pipe(fs.createWriteStream(pdfpath));
//             pdfDoc.moveDown(0.5)
//             pdfDoc
//                 .image('client/public/uploads/' + result.profile, {
//                     fit: [400, 150],
//                     align: 'center',
//                     valign: 'center'
//                 });
//             pdfDoc.moveDown(0.5)
//             pdfDoc.fontSize(25)
//             pdfDoc.text("First Name :- " + result.first_name);
//             pdfDoc.text("Last Name :- " + result.last_name);
//             pdfDoc.text("Email Id :- " + result.email_id);
//             pdfDoc.text("Department :- " + result.Department);
//             pdfDoc.text("Contact No :- " + result.contact_no);
//             pdfDoc.text("Birthday :- " + result.birthday);
//             pdfDoc.text("graduation year :- " + result.graduation_year);
//             pdfDoc.text("Profile :- " + result.profile);
//             pdfDoc.text("Password :- " + result.password);
//             pdfDoc.end();
//         })
//         .catch(err => {
//             res.status(500).send(err)
//         })
// })

/*  +--------------------------------+
    |        Ftech Pdf Create        |
    +--------------------------------+  */
// router.get('/fetchpdf/:id',(req, res) => {
//     const id = req.params.id
//     student.findById({ _id: id })
//         .exec()
//         .then(result => {
//             var today = new Date();
//             var Pdf_Data = result.first_name + "_" + result.first_name + "_" + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear() + ".pdf"
//             //res.sendFile("./"+ Pdf_Data)
//             var file = fs.createReadStream('./PDF/' + Pdf_Data);
//             file.pipe(res);
//         })
//         .catch(err => {
//             res.json({ msg: "errrooreor" })
//         })
// })

module.exports = router;
