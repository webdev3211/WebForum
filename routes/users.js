var express = require('express');
var router = express.Router();
var User = require('../models/users');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var verifyToken = require('../middleware/auth');
var Post = require('../models/posts');
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

var upload = multer({
    storage: storage
});





//===========================================
//THis Is IMPORTANT !!IT IS A REQUEST HANDLER WHEN USER CLICK
//ON THIS IT WILL MAKE PARTICULAR NOTIFATION SEEN AND REDIRECT TO
//RELEVANT POST
//Notifiction handler to make it seen
//SEEN NOT WORKING WITH REDIRECT 
//REDIRECT NOT WORKING WITH SEEN
//INSTEAD OF PASSING USERID WE CAN USE VERIFY TOKEN
//========================================================

router.get('/notification/:id', verifyToken, (req, res) => {
    if (!req.params.id)
        return res.status(501).json({
            success: false,
            message: "No Notification Id detected"
        });
    User.findById(req.decoded.userId)
        .then(data => {
            data.notification.id(req.params.id).isSeen = true;
            var link = data.notification.id(req.params.id).link;
            data.save();
            res.status(200).json({
                success: true,
                data: data
            });
        })
        .catch(err => {
            res.status(200).json({
                success: false,
                message: "User not found"
            });
        });
});


/*===========================================
//SHOW MY NOTIFIACTION SYSTEM BUT THIS DATA IS ALSO AVAILABLE 
//WITH USER DATA SO THIS MAY OR NOT BE HELPFUL THIS IS DONE FOR
//TESTING PURSPOSE
===========================================*/
router.get('/notifications', verifyToken, (req, res, next) => {
    User.findOne({
            _id: req.decoded.userId
        }).then(data => {
            if (data) {
                res.status(200).json({
                    success: true,
                    data: data.notification,
                    message: 'notification of users'
                })

            } else {
                res.status(501).json({
                    message: 'error fetching notification of user',
                    success: false
                })
            }
        })
        .catch(err => {
            res.status(501).json({
                success: false,
                message: "No user found"
            });
        });
});




//////////////////////////////
/*router.post('/notification/:id',(req,res,next)=>{
    User.findById(req.params.id)
           .then(data=>{
            if(data)
            {
                var comment={
                    content:req.body.content,
                    isSeen:false,
                    link:req.body.link
                }
                data.notification.push(comment);
                data.save()
                .then(user=>{
                    res.status(200).json({
                        success:true,
                        data:user
                    });
                }).catch(err=>{
                    res.status(501).json({
                        success:false,
                        message:"Unable to save",
                        error:err
                    });
                })

            }
           })
           .catch(err=>{
              res.status(501).json({
                  success:false,
                  message:"No user found"
              }); });
});





/*==============================================
//EDIT PROFILE AND UPLOAD IMAGE
===============================================*/
router.post('/profile/:id', upload.single('image'), (req, res, next) => {

    if (req.file)
        req.body.image = req.file.filename;
    //req.decoded.userId
    User.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(501).json({
                success: false,
                message: "Unable to Update"
            });
        });
});

/*==============================================
//LIST ALL USERS
===============================================*/
router.get('/allusers', (req, res, next) => {
    User.find({}).select('name email').then(
        (data) => {
            if (!data)
                return res.status(501).json({
                    success: false,
                    message: "No users found!"
                });
            res.status(200).json({
                success: true,
                data: data
            });

        }
    ).catch((err) => {
        res.status(501).json({
            success: false,
            message: "Unable to Find Users"
        });
    });
});


/*==============================================
//SHOW MY OWN POSTS ROUTE
===============================================*/
router.get('/myposts', (req, res) => {
    Post.find({
            author: req.decoded.userId
        })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(501).json({
                error: err
            });
        });

});





/* ================================================
// ROUTE FOR LOGIN
================================================== */

router.post('/login', (req, res, next) => {

    if (!req.body.email) {
        res.json({
            success: false,
            message: 'No email was provided'
        }); // Return error
    } else {
        // Check if password was provided
        if (!req.body.password) {
            res.json({
                success: false,
                message: 'No password was provided.'
            }); // Return error
        } else {
            User.findOne({
                email: req.body.email.toLowerCase()
            }, (err, user) => {
                // Check if email was found
                if (!user) {
                    res.json({
                        success: false,
                        message: 'Email not found '
                    }); // Return error
                } else {
                    const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
                    // Check if password is a match
                    if (!validPassword) {
                        res.json({
                            success: false,
                            message: 'Password invalid'
                        }); // Return error
                    } else {
                        const token = jwt.sign({
                            userId: user._id,
                            name: user.name
                        }, 'somesecretkey', {
                            expiresIn: '24h'
                        }); // Create a token for client
                        res.json({
                            success: true,
                            message: 'Success!',
                            token: 'Bearer ' + token,
                            user: {
                                name: user.name
                            }
                        }); // Return success and token to frontend
                    }
                };

            })
        }
    }
});


/* ===============================================================
   Route to get user's profile data
=============================================================== */
router.get('/profile', verifyToken, (req, res) => {
    // Search for user in database
    User.findOne({
        _id: req.decoded.userId
    }).select('name email').exec((err, user) => {
        // Check if error connecting
        if (err) {
            res.json({
                success: false,
                message: err
            }); // Return error
        } else {
            // Check if user was found in database
            if (!user) {
                res.json({
                    success: false,
                    message: 'User not found'
                }); // Return error, user was not found in db
            } else {
                res.json({
                    success: true,
                    user: user
                }); // Return success, send user object to frontend for profile
            }
        }
    });
});



/* ================================================
//POST ROUTE FOR SIGNUP
================================================ */


router.post('/signup', (req, res, next) => {
    if (!req.body.email) {
        res.json({
            success: false,
            message: 'You must provide an e-mail'
        }); // Return error
    } else {
        // Check if username was provided
        if (!req.body.name) {
            res.json({
                success: false,
                message: 'You must provide a name'
            }); // Return error
        } else {
            // Check if password was provided
            if (!req.body.password) {
                res.json({
                    success: false,
                    message: 'You must provide a password'
                }); // Return error
            } else {
                User.find({
                        email: req.body.email
                    })
                    .exec()
                    .then(users => {
                        if (users.length >= 1)
                            return res.status(500).json({
                                success: false,
                                error: "Email already exists"
                            });
                        else {

                            var user = new User({
                                _id: new mongoose.Types.ObjectId(),
                                name: req.body.name,
                                email: req.body.email,
                                password: req.body.password

                            });
                            user.save()
                                .then(data => {
                                    res.status(200).json({
                                        success: true,
                                        message: 'Acount registered!',
                                        user: data
                                    });
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        error: err
                                    });
                                });


                        }
                    }).catch(err => {
                        return res.status(500).json({
                            error: err
                        });
                    });
            }
        }
    }
});

module.exports = router;

/* ================================================
MIDDLEWARE - Used to grab user's token from headers
================================================ 

//Verify if token is present or not
function verifyToken(req, res, next) {
    var bearerHeader = req.headers['authorization']; // Create token found in headers
    // Check if token was found in headers
    if (bearerHeader !== undefined) {
        var bearer = bearerHeader.split(' ');
        var bearerToken = bearer[1];
        req.token = bearerToken;
    }

    if (!bearerToken) {
        res.json({
            success: false,
            message: 'No token provided'
        }); // Return error
    } else {
        // Verify the token is valid
        jwt.verify(req.token, 'somesecretkey', (err, decoded) => {
            // Check if error is expired or invalid
            if (err) {
                res.status(403).json({
                    success: false,
                    message: 'Token invalid: ' + err
                }); // Return error for token validation
            } else {
                req.decoded = decoded; // Create global variable to use in any request beyond
                next(); // Exit middleware
            }
        });
    }
}


*/


/* ================================================
//FORGOT PASSWORD
================================================


// forgot password
router.get('/forgot', function (req, res) {
    res.render('forgot');
  });
  
  router.post('/forgot', function (req, res, next) {
    async.waterfall([
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({
          email: req.body.email
        }, function (err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          auth: {
            user: 'webdev3211@gmail.com',
            pass: 'simplepassword'
          }
  
  
        });
        var mailOptions = {
          to: user.email,
          from: 'webdev3211@gmail.com',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function (err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });
  
  router.get('/reset/:token', function (req, res) {
    User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: {
        $gt: Date.now()
      }
    }, function (err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {
        token: req.params.token
      });
    });
  });
  
  router.post('/reset/:token', function (req, res) {
    async.waterfall([
      function (done) {
        User.findOne({
          resetPasswordToken: req.params.token,
          resetPasswordExpires: {
            $gt: Date.now()
          }
        }, function (err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if (req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function (err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function (err) {
                req.logIn(user, function (err) {
                  done(err, user);
                });
              });
            })
          } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
          }
        });
      },
      function (user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'webdev3211@gmail.com',
            pass: 'simplepassword'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'webdev3211@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function (err) {
      res.redirect('/campgrounds');
    });
  });

   */