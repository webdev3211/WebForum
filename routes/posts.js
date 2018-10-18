var express = require('express');
var router = express.Router();
var User = require('../models/users');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var async = require('async');
var verifyToken = require('../middleware/auth');
var Post = require('../models/posts');

var Tag = require('../models/tags');




/*================================================
//Route for Searching 
==================================================*/
router.post('/search', (req, res, next) => {
    var q = req.body.search;
    if (!req.body.search) {

    } else {
        // console.info(q);
        Post.find({
                title: {
                    '$regex': q,
                    '$options': 'i'
                }
            }).select('title')
            .then(data => {
                if (data.length === 0)
                    return res.status(200).json({
                        success: false,
                        message: "No Result Found!"
                    })
                res.status(200).json({
                    success: true,
                    data: data
                });
            })
            .catch(err => {
                res.status(501).json({
                    success: false,
                    message: "Unable to find!"
                });
            });
    }
    // console.log(req.query);
    /*  res.status(200).json({
          query:req.query
      });*/

});

/* ================================================
// Route to get posts according to tag
 ================================================== */

router.get('/tags/:tagId', (req, res, next) => {

    if (!req.params.tagId)
        return res.status(501).json({
            success: false,
            message: "No tag provided"
        });
    else {
        Post.find({
                tag: req.params.tagId
            })
            .then(data => {
                if (!data)
                    return res.status(501).json({
                        success: false,
                        message: "No Data"
                    });

                res.status(200).json({
                    success: true,
                    post: data
                });
            }).catch(
                err => {
                    res.status(501).json({
                        success: false,
                        message: "Unable to fetch post related with this tag"
                    });
                }
            );
    }
});


/* ================================================
//Route to send count of posts related with this tag
================================================== */


router.get('/tags/count/:tagId', (req, res, next) => {

    if (!req.params.tagId)
        return res.status(501).json({
            success: false,
            message: "No tag provided"
        });
    else {
        Post.find({
                tag: req.params.tagId
            })
            .then(data => {
                if (!data)
                    return res.status(501).json({
                        success: false,
                        message: "No Data"
                    });

                res.status(200).json({
                    success: true,
                    count: data.length
                });
            }).catch(
                err => {
                    res.status(501).json({
                        success: false,
                        message: "Unable to fetch post related with this tag"
                    });
                }
            );
    }
});



//ALL COMMENTS ROUTES

/* ================================================
  1) Route to create comment
 ================================================== */

router.post('/comment', verifyToken, (req, res, next) => {
    Post.findById(req.body.id).then(post => {
        if (!post) {
            return res.status(501).json({
                success: false,
                message: "No post found"
            });
        } else {
            if (!req.body.comment) {
                res.json({
                    success: false,
                    message: 'No comment provided'
                })
            } else {
                var comment = {
                    name: req.decoded.name,
                    comment: req.body.comment,
                    commentator: req.decoded.userId
                };
                post.comments.push(comment);
                post.save().then(upost => {

                    ///NOTIFICATION START
                    if(upost.author.toString()!==req.decoded.userId.toString()){
                    User.findById(upost.author)
                        .then(data => {
                            if (data) {
                                var notification = {
                                    content: req.decoded.name + " has answered your question",
                                    isSeen: false,
                                    link: post._id
                                }
                                //data.notification.push(notification);
                                data.notification.unshift(notification);
                                data.save()
                                    .then(user => {
                                        //  res.status(200).json({
                                        //      success:true,
                                        //      data:user
                                        //  });

                                        res.status(200).json({
                                            success: true,
                                            post: upost,
                                            message: 'Commented!!'
                                        });



                                    }).catch(err => {
                                        res.status(501).json({
                                            success: false,
                                            message: "Unable to save",
                                            error: err
                                        });
                                    })

                            }
                        })
                        .catch(err => {
                            res.status(501).json({
                                success: false,
                                message: "No user found"
                            });
                        });


                    }
                    else
                    {
                        res.status(200).json({
                        success: true,
                        post: upost,
                        message: 'Commented!!'
                       });

                    }

                    ///NOTIFICATION END
                    // res.status(200).json({
                    //     success: true,
                    //     post: data,
                    //     message: 'Commented!!'
                    // });





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
router.put('/like', verifyToken, (req, res, next) => {
    if (!req.body.id) {
        res.json({
            success: false,
            message: 'No id was provided.'
        });
    } else {
        Post.findOne({
            _id: req.body.id
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

router.put('/dislike', verifyToken, (req, res, next) => {
    // Check if id was provided inside the request body
    if (!req.body.id) {
        res.json({
            success: false,
            message: 'No id was provided.'
        });
    } else {
        // Search database for  post using the id
        Post.findOne({
            _id: req.body.id
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

router.post('/', (req, res) => {

    let limit = parseInt(req.query.limit);
    let page = parseInt(req.body.page || req.query.page);
    // let query = {};

    if (!limit || limit < 1) {
        limit = 10;
    }

    if (!page || page < 1) {
        page = 1;
    }


    var offset = (page - 1) * limit;


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

                // Post.count(query, function (err, count) {
                //     if (count > offset) {
                //         offset = 0;
                //     }
                // });

                var query = Post.find({});

                // .populate([
                //     // here array is for our memory. 
                //     // because may need to populate multiple things
                //     {
                //         path: 'author',
                //         select: 'name',
                //         model: 'Post',
                //     },
                //     {
                //         path: 'Tag',
                //         select: 'tag',
                //         model: 'Tag',
                //     }
                // ]);



                var options = {
                    sort: {
                        _id: -1
                    },
                    offset: offset,
                    limit: limit,
                    lean: true,
                    populate: ['tag', 'author'],
                    model: ['Tag', 'User'],
                };




                Post.paginate(query, options, (function (err, posts) {
                    res.status(201).json({
                        success: true,
                        posts: posts
                    });
                }));
            }
        }
    })
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
                        // post.viewcount++;
                        // post.save();
                        res.status(200).json({
                            message: 'Voila',
                            success: true,
                            post: post
                        })
                    }

                }
            }
        ).populate('author', 'name').populate('tag', 'tag');
    }
});


/* ================================================
//3 Protected Route for Post creation
================================================== */
router.post('/createPost', verifyToken, (req, res) => {

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
            if (!req.body.tag) {
                res.json({
                    success: false,
                    message: 'Post tag is required'
                })
            } else {
                Tag.findOne({
                    _id: req.body.tag
                }, (err, tag) => {
                    if (err) {
                        res.status(501).json({
                            success: false,
                            message: 'Not a valid tag ID'
                        })
                    } else {
                        var post = new Post({
                            _id: new mongoose.Types.ObjectId(),
                            title: req.body.title,
                            content: req.body.content,
                            author: req.decoded.userId,
                            tag: req.body.tag //It is id actually
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
                })
            }
        }
    }
});



/* ================================================
// 4 Protected Route for Updating/Editing Posts
================================================== */

router.put('/updateBlog', verifyToken, (req, res) => {
    //Not checked if author is trying to update anothers post id
    if (!req.body._id) {
        res.json({
            success: false,
            message: 'No post is provided'
        })
    } else {
        Post.findOne({
            _id: req.body._id
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
                        Post.findByIdAndUpdate(req.body._id, req.body, {
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
router.delete('/deleteBlog/:id', verifyToken, (req, res) => {
    if (!req.params.id) {
        res.json({
            success: false,
            message: 'No ID was provided'
        })
    } else {
        Post.findOne({
            _id: req.params.id
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
                        message: 'post was not found'
                    })
                } else {
                    User.findOne({
                        _id: req.decoded.userId
                    }, (err, user) => {
                        if (err) {
                            res.json({
                                success: false,
                                message: err
                            })
                        } else {
                            if (!user) {
                                res.json({
                                    success: false,
                                    message: 'Unable to authenticate user'
                                })
                            } else {
                                if (req.decoded.userId != post.author._id) {
                                    res.json({
                                        success: false,
                                        message: 'You are not authorized to delete this post'
                                    })
                                } else {
                                    post.remove((err) => {
                                        if (err) {
                                            res.json({
                                                success: false,
                                                message: err
                                            })
                                        } else {
                                            res.json({
                                                success: true,
                                                message: 'post deleted'
                                            })
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            }
        });
    }
});




//Exporting the module
module.exports = router;




///pagination
// router.get('/p', (req, res, next) => {

//     if (!req.query.page)
//         return res.status(501).json({
//             success: false,
//             message: "Invalid Page"
//         });
//     var page = parseInt(req.query.page);
//     var postPerPage = 3;
//     Post.find({}, (err, posts) => {
//         if (err) {
//             res.status(501).json({
//                 success: false,
//                 message: err
//             })
//         } else {
//             if (!posts) {
//                 res.json({
//                     success: false,
//                     message: 'No posts found'
//                 })
//             } else {
//                 res.status(200).json({
//                     success: true,
//                     posts: posts
//                 })
//             }
//         }
//     }).populate('author', 'name').sort({ //show the latest post (descending order)
//         '_id': -1
//     }).populate('tag', 'tag').skip((page - 1) * postPerPage).limit(postPerPage);
// });