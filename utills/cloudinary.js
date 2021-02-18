const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: 'djt8tadas',
  api_key: '953761286169972',
  api_secret: 'bqTWLuws4acTPKboZibNTcIIqX0',
});

module.exports = cloudinary;