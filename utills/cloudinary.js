const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: 'djt8tadas',
  api_key: '953761286169972',
  api_secret: 'bqTWLuws4acTPKboZibNTcIIqX0',
});

module.exports = cloudinary;

exports.uploads = (file) =>{
  return new Promise(resolve => {
  cloudinary.uploader.upload(file, (result) =>{
  resolve({url: result.url, id: result.public_id})
  }, {resource_type: "auto"})
  })
}