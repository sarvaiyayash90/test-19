const multer = require("multer");
const path = require("path");

// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);  
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//       cb(null, 'client/public/uploads');
//   },
//   filename: function (req, file, cb) {
//       photo_name = Date.now() + path.extname(file.originalname)
//       //cb(null, file.originalname)
//       cb(null, photo_name);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
//   if (allowedFileTypes.includes(file.mimetype)) {
//       cb(null, true);
//   } else {
//       cb(null, false);
//   }
// }