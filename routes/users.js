var express = require('express');
var router = express.Router();
var User = require('../models/users');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
//POST ROUTE FOR LOGIN
router.post('/login', (req, res, next) => {

    User.find({ email: req.body.email, password: req.body.password })
        .then(user => {
            if (user.length < 1)
                return res.status(500).json({ message: "Invalid Credentials" });
            else {
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    "somesecretkey",
                    {
                        expiresIn: "1h"
                    }
                );
                res.status(200).json({ message: "Auth success", token: token });
            }
        }).catch(err => {
            res.status(500).json({ error: err });
        });
});

//Verify if token is present or not
function verifyToken(req,res,next)
{
      var bearerHeader=req.headers['authorization'];
      if(bearerHeader!==undefined)
      {
              var bearer=bearerHeader.split(' ');
              var bearerToken=bearer[1];
              req.token=bearerToken;
              next();
      }
      else
      {
          res.status(403).json({error:"Forbidden"});
      }
}

//Route For profile Information

router.get('/profile',verifyToken,(req,res,next)=>{
   jwt.verify(req.token,"somesecretkey",(err,data)=>{
      if(err)
      res.status(401).json({error:err});
      else{
        User.findById(data.userId)
             .then(data=>{
                 res.status(200).json(data);
             })
             .catch(err=>{res.status(500).json({error:err})});
        //res.status(200).json(data);
      }
   });

});


//POST ROUTE FOR SIGNUP

router.post('/signup', (req, res, next) => {

    User.find({ email: req.body.email })
        .exec()
        .then(users => {
            if (users.length >= 1)
                return res.status(500).json({ error: "Email already exists" });
            else {

                var user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password

                });
                user.save()
                    .then(data => { res.status(200).json(data); })
                    .catch(err => {
                        res.status(500).json({ error: err });
                    });


            }
        }).catch(err => {
            return res.status(500).json({ error: err });
        });
});
module.exports = router;