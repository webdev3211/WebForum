var express = require('express');
var router = express.Router();
var User = require('../models/users');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var async = require('async');
var verifyToken = require('../middleware/auth');
var Post = require('../models/posts');



// Route to get posts according to tag
router.get('/:tagId',(req,res,next)=>{

    if(!req.params.tagId)
    return res.status(501).json({
        success:false,
        message:"No Data"
    });
    Post.find({tag:req.params.tagId}).then(
        data=>{
            if(!data)
            return res.status(501).json({
                success:false,
                message:"No Data"
            });
            
            res.status(200).json({
                success:true,
                data:data
            });
        }
    ).catch(
        err=>{
            res.status(501).json({
                success:false,
                message:"Unable to fetch data from db"
            });
        }
    );
});

//ALL COMMENTS ROUTES

/* ================================================
  1) Route to create comment
 ================================================== */

router.post('/:postId/comment', verifyToken, (req, res, next) => {
    Post.findById(req.params.postId).then(post => {
        if (!post) {
            return res.status(501).json({
                success: false,
                message: "No post found"
            });
        } else {
            if (!req.body.text) {
                res.json({
                    success: false,
                    message: 'No comment provided'
                })
            } else {
                var comment = {
                    name: req.decoded.name,
                    text: req.body.text,
                    commentator: req.decoded.userId
                };
                post.comments.push(comment);
                post.save().then(data => {
                    res.status(501).json({
                        success: true,
                        post: data
                    });
                }).catch(err => {
                    res.status(501).json({
                        success: false,
                        error: "Error while commenting on the post, please try again later!!"
                    });
                });
            }
        }
    }).catch(err => {
        res.status(501).json({
            success: false,
            error: "No post found with this id!"
        });
    });

});




/* ================================================
//Comment update
================================================== */

router.put('/:postId/comment/:commentId', (req, res, next) => {

    Post.findById(req.params.postId).then(post => {
            if (!post) {
                return res.status(501).json({
                    success: false,
                    message: "No such post found with this id!"
                });
            } else {
                if (!post.comments.id(req.params.commentId)) {
                    return res.status(501).json({
                        success: false,
                        message: 'No such comment with this id exist in the post'
                    })
                } else {
                    if (!req.body.text) {
                        return res.status(501).json({
                            success: false,
                            error: 'Comment cannot be blank'
                        })
                    } else {
                        post.comments.id(req.params.commentId).text = req.body.text;
                        ////************************************ *  this code is not running/
                        // console.log(post.comments.id(req.params.commentId).commentator._id == req.decoded.userId);

                        ////************************************ */

                        //now save it                         
                        post.save()
                            .then(data => {
                                res.status(200).json({
                                    success: true,
                                    post: data,
                                    message: 'Comment updated successfully'
                                });

                            })
                            .catch(err => {
                                res.status(501).json({
                                    success: false,
                                    data: "Unable to edit your comment"
                                });

                            });

                    }

                }

            }
        })
        .catch(
            err => {
                res.status(501).json({
                    success: false,
                    data: "No post Found"
                });

            }
        );

});


/* ================================================
//comment delete
================================================== */


router.delete('/:postId/comment/:commentId', (req, res, next) => {

    Post.findById(req.params.postId).then(post => {
            if (!post) {
                return res.status(501).json({
                    success: false,
                    message: "No such post found with this id!"
                });
            } else {
                if (!post.comments.id(req.params.commentId)) {
                    return res.status(501).json({
                        success: false,
                        message: 'No such comment with this id exist in the post'
                    })
                } else {
                    ////************************************ *  this code is not running/
                    // console.log(post.comments.id(req.params.commentId).commentator._id == req.decoded.userId);
                    ////************************************ */
                    post.comments.id(req.params.commentId).remove();
                    //now save the post
                    post.save()
                        .then(data => {
                            res.status(200).json({
                                success: true,
                                post: data,
                                message: 'Comment removed successfully'
                            });

                        })
                        .catch(err => {
                            res.status(501).json({
                                success: false,
                                data: "Unable to Delete the comment"
                            });

                        });
                }
            }

        })
        .catch(
            err => {
                res.status(501).json({
                    success: false,
                    error: err
                });

            }
        );

});





/* ===============================================================
     LIKE  POST
  =============================================================== */
router.post('/:postId/like', verifyToken, (req, res, next) => {
    if (!req.params.postId) {
        res.json({
            success: false,
            message: 'No id was provided.'
        });
    } else {
        Post.findOne({
            _id: req.params.postId
        }, (err, post) => {
            // Check if error was encountered
            if (err) {
                res.json({
                    success: false,
                    message: 'Invalid post id'
                });
            } else {
                // Check if id matched the id of a post  in the database
                if (!post) {
                    res.json({
                        success: false,
                        message: 'That post was not found.'
                    });
                } else {

                    // Check if user who liked post is the same user that originally created the  post
                    if (req.decoded.userId == post.author._id) {
                        res.json({
                            success: false,
                            message: 'Cannot like your own post.'
                        });
                    } else {
                        // Check if the user who liked the post has already liked the  post before
                        if (post.likedBy.includes(req.decoded.userId)) {
                            res.json({
                                success: false,
                                message: 'You already liked this post.'
                            });
                        } else {

                            // Check if user who liked post has previously disliked a post
                            if (post.dislikedBy.includes(req.decoded.userId)) {
                                post.dislikes--; // Reduce the total number of dislikes
                                const arrayIndex = post.dislikedBy.indexOf(req.decoded.userId); // Get the index of the username in the array for removal
                                post.dislikedBy.splice(arrayIndex, 1); // Remove that userId from disliked array
                                post.likes++; // Increment likes
                                post.likedBy.push(req.decoded.userId); // Add userId to the array of likedBy array
                                // Save post  data
                                post.save((err) => {
                                    // Check if error was found
                                    if (err) {
                                        res.json({
                                            success: false,
                                            message: 'Something went wrong.'
                                        });
                                    } else {
                                        res.json({
                                            success: true,
                                            message: 'disliked post now  liked !'
                                        });

                                    }
                                });
                            } else {
                                post.likes++; // Incriement likes
                                post.likedBy.push(req.decoded.userId); // Add liker's id into array of likedBy
                                // Save  post
                                post.save((err) => {
                                    if (err) {
                                        res.json({
                                            success: false,
                                            message: 'Something went wrong.'
                                        });
                                    } else {
                                        res.json({
                                            success: true,
                                            message: 'Post liked!'
                                        });

                                    }
                                });
                            }
                        }
                    }
                }
            }
        });
    }

});


/* ===============================================================
   DISLIKE  POST
=============================================================== */

router.post('/:postId/dislike', verifyToken, (req, res, next) => {
    // Check if id was provided inside the request body
    if (!req.params.postId) {
        res.json({
            success: false,
            message: 'No id was provided.'
        });
    } else {
        // Search database for  post using the id
        Post.findOne({
            _id: req.params.postId
        }, (err, post) => {
            // Check if error was found
            if (err) {
                res.json({
                    success: false,
                    message: 'Invalid post id'
                });
            } else {
                // Check if  post with the id was found in the database
                if (!post) {
                    res.json({
                        success: false,
                        message: 'That post was not found.'
                    });
                } else {

                    // Check if user who disliekd post is the same person who originated the post
                    if (req.decoded.userId == post.author._id) {
                        res.json({
                            success: false,
                            message: 'Cannot dislike your own post.'
                        });
                    } else {
                        // Check if user who disliked post has already disliked it before
                        if (post.dislikedBy.includes(req.decoded.userId)) {
                            res.json({
                                success: false,
                                message: 'You already disliked this post.'
                            });
                        } else {
                            // Check if user has previous liked this post
                            if (post.likedBy.includes(req.decoded.userId)) {
                                post.likes--; // Decrease likes by one
                                const arrayIndex = post.likedBy.indexOf(req.decoded.userId); // Check where username is inside of the array
                                post.likedBy.splice(arrayIndex, 1); // Remove username from index
                                post.dislikes++; // Increase dislikeds by one
                                post.dislikedBy.push(req.decoded.userId); // Add username to list of dislikers
                                // Save post data
                                post.save((err) => {
                                    // Check if error was found
                                    if (err) {
                                        res.json({
                                            success: false,
                                            message: 'Something went wrong.'
                                        });
                                    } else {
                                        res.json({
                                            success: true,
                                            message: 'Post disliked! which was liked previously'
                                        });

                                    }
                                });
                            } else {
                                post.dislikes++; // Increase likes by one
                                post.dislikedBy.push(req.decoded.userId); // Add userId to list of likers
                                // Save post data
                                post.save((err) => {
                                    // Check if error was found
                                    if (err) {
                                        res.json({
                                            success: false,
                                            message: 'Something went wrong.'
                                        });
                                    } else {
                                        res.json({
                                            success: true,
                                            message: 'Post disliked!'
                                        });

                                    }
                                });
                            }
                        }
                    }
                }
            }
        });
    }

});





//ALL POSTS ROUTES

/* ================================================
//1 Public post router to fetch all posts on the database
================================================== */

router.get('/', (req, res) => {

    Post.find({}, (err, posts) => {
        if (err) {
            res.status(501).json({
                success: false,
                message: err
            })
        } else {
            if (!posts) {
                res.json({
                    success: false,
                    message: 'No posts found'
                })
            } else {
                res.status(200).json({
                    success: true,
                    posts: posts
                })
            }
        }
    }).populate('author', 'name').sort({ //show the latest post (descending order)
        '_id': -1
    });
});

/* =================================================
//2 Public route to fetch SPECIFIC post by postid from db
================================================== */
router.get('/:postId', (req, res) => {
    if (!req.params.postId) {
        res.json({
            success: false,
            message: 'No Post ID was provided'
        });
    } else {
        Post.findOne({
                _id: req.params.postId
            },
            (err, post) => {
                if (err) {
                    res.json({
                        success: false,
                        message: 'Not a valid post ID'
                    })
                } else {
                    if (!post) {
                        res.json({
                            success: false,
                            message: 'Post Not Found'
                        })
                    } else {
                        res.status(200).json({
                            success: true,
                            post: post
                        })
                    }

                }
            }
        ).populate('tag','tag');
    }
});


/* ================================================
//3 Protected Route for Post creation
================================================== */
router.post('/', verifyToken, (req, res) => {

    if (!req.body.title) {
        res.json({
            success: false,
            message: 'Post title is required'
        });
    } else {
        if (!req.body.content) {
            res.json({
                success: false,
                message: 'Post content is required'
            })
        } else {
            var post = new Post({

                _id: new mongoose.Types.ObjectId(),
                title: req.body.title,
                content: req.body.content,
                author: req.decoded.userId,
                tag:req.body.tag //It is id actually
            });
            post.save().then(data => {
                res.status(200).json({
                    success: true,
                    message: 'Post Created Successfully',
                    post: data
                });
            }).catch(err => {
                res.status(501).json({
                    error: err
                })
            })
        }
    }
});


/* ================================================
// 4 Protected Route for Updating/Editing Posts
================================================== */

router.put('/:postId', verifyToken, (req, res) => {
    //Not checked if author is trying to update anothers post id
    if (!req.params.postId) {
        res.json({
            success: false,
            message: 'No post is provided'
        })
    } else {
        Post.findOne({
            _id: req.params.postId
        }, (err, post) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'Not a valid post ID'
                })
            } else {
                if (!post) {
                    res.json({
                        success: false,
                        message: 'post with this id was not found'
                    })
                } else {

                    if (post.author._id == req.decoded.userId) {
                        Post.findByIdAndUpdate(req.params.postId, req.body, {
                                new: true
                            })
                            .then(post => {
                                res.status(200).json({
                                    post: post,
                                    success: true,
                                    message: 'Post updated successfully'
                                });
                            })
                            .catch(err => {
                                res.status(501).json({
                                    error: err
                                });
                            });

                    } else {
                        res.status(501).json({
                            message: "You are not authorized to update this post",
                            success: false
                        });
                    }
                }
            }
        })
    }
});


/* ================================================
// 5 Proteted Route for Deletion of post specific post
================================================== */
router.delete('/:postId', verifyToken, (req, res) => {
    if (!req.params.postId) {
        res.json({
            success: false,
            message: 'No ID was provided'
        })
    } else {
        Post.findOne({
            _id: req.params.postId
        }, (err, post) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'Invalid ID'
                })
            } else {
                if (!post) {
                    res.json({
                        success: false,
                        message: 'Post was not found'
                    })
                } else {

                    if (post.author._id == req.decoded.userId) {
                        Post.findOneAndDelete(req.params.postId)
                            .then(post => {
                                res.status(200).json({
                                    success: true,
                                    message: 'Post deleted successfully'
                                })
                            })
                            .catch(err => {
                                res.status(501).json({
                                    error: err,
                                    message: 'Some error while deletion, please try again later'
                                });
                            });

                    } else {
                        res.status(501).json({
                            message: "You are not authorized to update this post",
                            success: false
                        })
                    }
                }
            }
        });
    }
});


//Exporting the module
module.exports = router;