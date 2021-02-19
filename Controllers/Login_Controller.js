const express = require('express');  // Express
const router = express.Router(); // Router
const login_schema = require('../Models/Login_Model'); // Login Model

/*
+--------------------------+
|      Login Check         |
+--------------------------+  */

router.post('/Login', (request, res) => {

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

router.get('/viewloginprofile/:id', async (req, res) => {
  try {
    const login_schema_new = await login_schema.findById(req.params.id)
    //console.log(login_schema_new);
    res.json(login_schema_new)
  } catch (err) {
    res.send('Error' + err)
  }
})



module.exports = router;
