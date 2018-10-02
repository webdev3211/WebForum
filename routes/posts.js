var express = require('express');
var router = express.Router();
var User = require('../models/users');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var verifyToken = require('../middleware/auth');
var Post = require('../models/posts');

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
        );
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
                author: req.decoded.userId
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
