var express=require('express');
var router   =express.Router();
var User     =require('../models/users');
var mongoose =require('mongoose');

router.post('/login',(req,res,next)=>{
    res.status(200).json({
        data:"user logged in"
    });
});

router.post('/signup',(req,res,next)=>{

    User.find({email:req.body.email})
               .exec()
               .then(users=>{
                   if(users.length>=1)
                   return res.status(500).json({error:"Email already exists"});
                   else
                   {

                    var user=new User({
                        _id: new mongoose.Types.ObjectId(),
                        name:req.body.name,
                        email: req.body.email,
                        password:req.body.password
                       
                    });
                    user.save()
                        .then(data=>{res.status(200).json(data);})
                        .catch(err=>{
                            res.status(500).json({error:err});
                         });

                       
                   }
               }).catch(err=>{
                   return res.status(500).json({error:err});
               });
});
module.exports=router;