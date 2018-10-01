var express = require('express');
var router = express.Router();
var User = require('../models/users');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var verifyToken=require('../middleware/auth');
var Post =require('../models/posts');

//1 Public post router to fetch all posts on the database
router.get('/',(req,res)=>{
  Post.find({}).populate('author','name')
               .exec().then(data=>{
                    res.status(200).json(data);
                })
               .catch(err=>{
                    res.status(501).json({error:err});
                 });
  //res.status(200).json({message:"All posts here"});
});

//2 Public route to fetch specific post by postid from db
router.get('/:postId',(req,res)=>{
    Post.findById(req.params.postId)
                        .then(data=>{
                            res.status(200).json(data);
                        })
                        .catch(err=>{ 
                            res.status(501).json({error:err});
                        });
   // res.status(200).json({message:req.params.postId+" posts here"});
});
//3 Protected Route for Post creation
router.post('/',verifyToken,(req,res)=>{
    var post=new Post({

        _id: new mongoose.Types.ObjectId(),
        title:req.body.title,
        content:req.body.content,
        author:req.decoded.userId
    });
    post.save().then(data=>{
        res.status(200).json(data);
    }).catch(err=>{
        res.status(501).json({error:err})
    })
    //res.status(200).json({message:"New Post created",data:req.body});
});

// 4 Protected Route for Updating/Editing Posts
router.put('/:postId',verifyToken,(req,res)=>{
    //Not checked if author is trying to update anothers post id
    
    Post.findById(req.params.postId)
                        .then(data=>{
                            if(data.author._id==req.decoded.userId)
                             {
                                Post.findByIdAndUpdate(req.params.postId,req.body,{new: true})
                                .then(data=>{
                                      res.status(200).json(data);
                                  })
                                .catch(err=>{ 
                                  res.status(501).json({error:err});
                                });

                             }
                             else
                             {
                                 res.status(501).json({message:"You are not author"});
                             }
                        })
                        .catch(err=>{
                            res.status(501).json({error:err});
                        });

    
    //res.status(200).json({message:"Post Updated",data:req.body});
    
});
// 5 Proteted Route for DEletion of post obviously specific post
router.delete('/:postId',verifyToken,(req,res)=>{
    //Not checked if author is trying to update anothers post id
    Post.findById(req.params.postId)
    .then(data=>{
        if(data.author._id==req.decoded.userId)
         {
            Post.findByIdAndRemove(req.params.postId)
                 .then(data=>{
                    res.status(200).json({message:"Deleted Successful"});
                })
              .catch(err=>{ 
                res.status(501).json({error:err});
                 });

         }
         else
         {
             res.status(501).json({message:"You are not author"});
         }
    })
    .catch(err=>{
        res.status(501).json({error:err});
    });
          
    //res.status(200).json({message:"Post DEleted"+req.params.postId});

});
//Exporting the module
module.exports=router;