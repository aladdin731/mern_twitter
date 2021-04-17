const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
// import model
const User = require('../../models/User');

const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// import defined validation in validation folder
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


// create our private auth route
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  // res.json({
  //   id: req.user.id,
  //   handle: req.user.handle,
  //   email: req.user.email
  // });
  res.send(req.user);
})

// set up a route to register new users
router.post('/register', (req, res) => {
  // Check to make sure nobody has already registered with a duplicate email
  const {errors, isValid} = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        // Throw a 400 error if the email address already exists
        return res.status(400).json({email: "A user has already registered with this address"})
      } else {
        // Otherwise create a new user
        const newUser = new User({
          handle: req.body.handle,
          email: req.body.email,
          password: req.body.password
        })

        // newUser.save() // just for testing, take this out
        //       .then(user => res.json(user)) // just for testing, take this out
        //       .catch(err => console.log(err)); // just for testing, take this out

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          })
        })
      }
    })
})


router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    console.log(errors);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;
  
    User.findOne({email})
      .then(user => {
        if (!user) {
          return res.status(404).json({email: 'This user does not exist'});
        }
  
        bcrypt.compare(password, user.password)
        .then(isMatch => {
            if (isMatch) {
              // res.json({msg: "Success!"}); // just for testing
              const payload = {id: user.id, handle: user.handle, email: user.email};

              jwt.sign(
                  payload,
                  keys.secretOrKey,
                  // Tell the key to expire in one hour
                  {expiresIn: 3600},
                  (err, token) => {
                  res.json({
                      success: true,
                      token: 'Bearer ' + token
                  });
                });
            } else {
                return res.status(400).json({password: 'Incorrect password'});
            }
        })
      })
  })



// set up a route
router.get("/test", (req, res) => res.json({ msg: "This is the users route" }));

module.exports = router;